#!/bin/bash


#
# 	
#
#   example :
#   sudo bash script.sh -c link
#   sudo bash script.sh -c install

while getopts c: option
do
case "${option}"
in
c) COMMAND=${OPTARG};;
esac
done



# ------------------------------------------
# LINK TO LOCAL MODULE DIRECTORIES 
if [ $COMMAND = "link" ]
then
	echo "LINKING TO LOCAL MODULE DIRECTORIES ... "
	npm link enco-poodle-mode-simple
fi

# ------------------------------------------
# INSTALL LATEST VERSION FROM NPM AND UPDATE package.json
if [ $COMMAND = "install" ]
then
	echo "INSTALLING LATEST VERSION OF NPM PACKAGES AND UPDATE package.json ... "
	npm install enco-poodle-mode-simple
fi

