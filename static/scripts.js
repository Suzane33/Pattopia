document.addEventListener('DOMContentLoaded', () => {
    // Affichage d'animaux aleatoirement
    fetch('/api/random-animals')
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById('random-animals');
            container.innerHTML = '';  
            data.forEach(animal => {
                const animalDiv = document.createElement('div');
                animalDiv.className = 'animal-card';
                animalDiv.innerHTML = `
                    <h2>${animal.nom}</h2>
                    <p>${animal.description}</p>
                    <a href="/animal/${animal.id}">Voir les détails</a>
                `;
                container.appendChild(animalDiv);
            });
        })
        .catch(error => console.error('Erreur lors de la récupération des animaux :', error));

    if (window.location.pathname.includes('/animal/')) {
        const animalId = window.location.pathname.split('/').pop();
        fetch(`/api/animal/${animalId}`)
            .then(response => response.json())
            .then(animal => {
                const container = document.getElementById('animal-details');
                container.innerHTML = `
                    <h1>${animal.nom}</h1>
                    <p>Espèce : ${animal.espece}</p>
                    <p>Race : ${animal.race}</p>
                    <p>Âge : ${animal.age}</p>
                    <p>Description : ${animal.description}</p>
                    <p>Propriétaire : <a href="mailto:${animal.courriel}">${animal.courriel}</a></p>
                    <p>Localisation : ${animal.adresse}, ${animal.ville}, ${animal.cp}</p>
                `;
            });
    }
});

// Formulaire d'ajout d'animal
document.getElementById('add-animal-form').addEventListener('submit', (event) => {
    event.preventDefault();

    document.querySelectorAll('.error').forEach(el => el.textContent = '');

    const messageContainer = document.getElementById('form-messages');
    messageContainer.textContent = '';  

    const nom = document.getElementById('nom').value;
    const espece = document.getElementById('espece').value;
    const race = document.getElementById('race').value;
    const age = document.getElementById('age').value;
    const description = document.getElementById('description').value;
    const courriel = document.getElementById('courriel').value;
    const adresse = document.getElementById('adresse').value;
    const ville = document.getElementById('ville').value;
    const cp = document.getElementById('cp').value;

    let isValid = true;

    if (!nom || nom.length < 3 || nom.length > 20 || nom.includes(',')) {
        document.getElementById('nom-error').textContent = 'Nom invalide.';
        isValid = false;
    }
    if (!espece || espece.includes(',')) {
        document.getElementById('espece-error').textContent = 'Espèce invalide.';
        isValid = false;
    }
    if (!race || race.includes(',')) {
        document.getElementById('race-error').textContent = 'Race invalide.';
        isValid = false;
    }
    if (!age || isNaN(age) || age < 0 || age > 30) {
        document.getElementById('age-error').textContent = 'Âge invalide.';
        isValid = false;
    }
    if (!description || description.includes(',')) {
        document.getElementById('description-error').textContent = 'Description invalide.';
        isValid = false;
    }
    if (!courriel || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(courriel)) {
        document.getElementById('courriel-error').textContent = 'Courriel invalide.';
        isValid = false;
    }
    if (!adresse || adresse.includes(',')) {
        document.getElementById('adresse-error').textContent = 'Adresse invalide.';
        isValid = false;
    }
    if (!ville || ville.includes(',')) {
        document.getElementById('ville-error').textContent = 'Ville invalide.';
        isValid = false;
    }
    if (!cp || !/^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$/.test(cp)) {
        document.getElementById('cp-error').textContent = 'Code postal invalide.';
        isValid = false;
    }

    if (isValid) {
        fetch('/api/add-animal', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nom, espece, race, age, description, courriel, adresse, ville, cp })
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    messageContainer.textContent = 'Animal ajouté avec succès !';
                    messageContainer.style.color = 'green';
                    document.getElementById('add-animal-form').reset();
                } else {
                    messageContainer.textContent = "Erreur lors de l'ajout de l'animal.";
                    messageContainer.style.color = 'red';
                }
            })
            .catch(error => {
                console.error('Erreur :', error);
                messageContainer.textContent = 'Erreur réseau, veuillez réessayer.';
                messageContainer.style.color = 'red';
            });
    }
});