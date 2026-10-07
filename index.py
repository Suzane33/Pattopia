# Copyright 2024 

# Bouchra Boumedien Groupe 40 BOUB81590205

# Suzane Benhabiles Groupe 20 BENL64280307

# Licensed under the Apache License, Version 2.0 (the "License");

# you may not use this file except in compliance with the License.

# You may obtain a copy of the License at

#

#     http://www.apache.org/licenses/LICENSE-2.0

#

# Unless required by applicable law or agreed to in writing, software

# distributed under the License is distributed on an "AS IS" BASIS,

# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.

# See the License for the specific language governing permissions and

# limitations under the License.


from flask import Flask, request

from flask import render_template

from flask import g

from flask import jsonify

import random

from database import Database


app = Flask(__name__, static_url_path="", static_folder="static")


def get_db():

    db = getattr(g, '_database', None)

    if db is None:

        g._database = Database()

    return g._database


@app.teardown_appcontext

def close_connection(exception):

    db = getattr(g, '_database', None)

    if db is not None:

        db.disconnect()


@app.route('/')

def home():

    return render_template('index.html')


@app.route('/form')

def form():

    return render_template('form.html')


@app.route('/liste')

def liste():

    db = get_db()

    animals = db.get_animaux()

    return render_template('liste.html', animals=animals)


@app.route('/search')

def search():

    query = request.args.get('query', '').lower()

    db = get_db()

    animals = db.get_animaux()

    results = [

        animal for animal in animals

        if query in animal['nom'].lower()

        or query in animal['espece'].lower()

        or query in animal['race'].lower()

        or query in str(animal['age']).lower()

        or query in animal['description'].lower()

        or query in animal['courriel'].lower()

        or query in animal['adresse'].lower()

        or query in animal['ville'].lower()

        or query in animal['cp'].lower()

    ]

    return render_template('resultat_recherche.html', animals=results)



@app.route('/animal/<int:animal_id>')

def animal_detail(animal_id):

    db = get_db()

    animal = db.get_animal(animal_id)

    if animal:

        return render_template('animal_detail.html', animal=animal)

    return "Animal pas trouvé", 404


@app.route('/api/random-animals')

def random_animals():

    db = get_db()

    animals = db.get_animaux()

    random_animals = random.sample(animals, min(5, len(animals)))

    return jsonify(random_animals)


@app.route('/api/add-animal', methods=['POST'])

def add_animal():

    data = request.json

    db = get_db()

    try:

        animal_id = db.add_animal(

            data['nom'],

            data['espece'],

            data['race'],

            data['age'],

            data['description'],

            data['courriel'],

            data['adresse'],

            data['ville'],

            data['cp']

        )
        return jsonify({'success': True, 'animal_id': animal_id}), 201

    except Exception as e:
        print(f"Erreur lors d'ajout d'animal: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500


if __name__ == '__main__':

    app.run(debug=True)
