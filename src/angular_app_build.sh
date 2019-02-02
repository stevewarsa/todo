# build UI
cd /cygdrive/c/backup/code/Angular2/todo
ng build --prod --base-href /todo/
ssh swarsa_memoryverses@ssh.phx.nearlyfreespeech.net "cd /home/public/todo; ls | grep -v server | grep -v main | grep -v view | xargs rm -rf"
cd /cygdrive/c/backup/code/Angular2/todo/dist/todo
scp -r * swarsa_memoryverses@ssh.phx.nearlyfreespeech.net:/home/public/todo
echo "From client side, invoking /home/private/deploy-todo.sh ..."
ssh swarsa_memoryverses@ssh.phx.nearlyfreespeech.net "/home/private/deploy-todo.sh"
cd /cygdrive/c/backup/code/Angular2/todo 
