# Auteur(s):
Bouchra Boumedien
Suzane Benhabiles
Pour exécuter le logiciel, on utilise un env. Voici les instructions à suivre:
# 1. Ouvrez PowerShell en tant qu'administrateur et exécutez :
Set-ExecutionPolicy RemoteSigned
# 2. Ouvrez une nouvelle fenêtre PowerShell (pas en tant qu'administrateur) et naviguez vers le répertoire du projet :
cd \path\to\Pattopia
# 3. Activez l'environnement virtuel :
.\env\Scripts\Activate.ps1
# 4. Installez Flask :
pip install flask
# 5. Définissez la variable d'environnement de l'application Flask :
$env:FLASK_APP = "index.py"
# 6. Exécutez l'application Flask :
flask run 
# 7. Executez le fichier python :
python index.py
# 8. Copiez le lien http donne par la commande :
# 9. Collez ce lien sur votre fureteur and enjoy !
