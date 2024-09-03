cd Documents/GitHub/React-Project
rsync -avz --exclude 'rsync.sh'  --exclude '.vscode' --exclude 'node_modules' --exclude '.git' -e "ssh -i ~/.ssh/SC-CAT-DT.pem" \. ubuntu@ec2-3-145-177-30.us-east-2.compute.amazonaws.com:~/app
