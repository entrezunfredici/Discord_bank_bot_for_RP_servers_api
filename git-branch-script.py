import os
print("========================================================================")
print("bienvennue dans le script de changement de branche git")
command="git checkout "
response=input("entrez le nom de la branche ⇒ ")
command=command+response
print("execution de la commande ⇒  "+command)
os.system(command)
command="git pull"
print("execution de la commande ⇒  "+command)
os.system(command)
print("========================================================================")