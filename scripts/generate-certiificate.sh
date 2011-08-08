if [ -d ./scripts ]; then

	echo 'Scripts directory exists, running key generation...'

	if [ ! -d ./conf ]; then
		echo 'Creating destination directory ./conf...'
		mkdir conf
	fi

	openssl req -x509 -nodes -days 365 \
	-subj '/C=US/ST=Georgia/L=Atlanta/O=node-explorer/CN=localhost' -newkey rsa:1024 \
	-keyout ./conf/key.pem -out ./conf/cert.pem
	echo 'Success, finished!'

else
	echo 'Please call ./scripts/generate-certificate.sh from the root application directory.'
fi
