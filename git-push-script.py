import os
print("========================================================================")
print("bienvennue dans le script de push git")
command="git add ."
print("execution de la commande ⇒  "+command)
os.system(command)
command="git commit -m "
response=input("entrez le nom votre commit ⇒ ")
command=command+'"'+response+'"'
print("execution de la commande ⇒  "+command)
os.system(command)
command="git push"
print("execution de la commande ⇒  "+command)
os.system(command)
print("========================================================================")