
# Spotify CUFE 2020 API
> This is our Spotify API made as an academic project at CUFE.

## Table of contents
* [Technologies](#technologies)
* [Pre-requisites for installation](#pre-requisites-for-installation)
* [Package installation](#package-installation)
* [Pre-requisites for running](#pre-requisites-for-running)
* [Unit tests](#unit-tests)
* [How to run for developers](#how-to-run-for-developers)
* [How to run for production](#how-to-run-for-production)
* [Functional documenation generation](#functional-documentation-generation)
* [API documenation generation](#api-documentation-generation)




## Technologies
* NodeJS 
* Express
* MongoDB


## Pre-requisites for installation

 1. **NodeJS**:  
 
 Run the following in terminal
 

	       # Using Ubuntu
	       $ curl -sL https://deb.nodesource.com/setup_13.x | sudo -E bash -
	       $ sudo apt-get install -y nodejs
		   
	       # Using Debian, as root
	       $ curl -sL https://deb.nodesource.com/setup_13.x | bash -
	       $ apt-get install -y nodejs

 
 2. **MongoDB**:
	 1.  Import the public key used by the package management system
	  `wget -qO - https://www.mongodb.org/static/pgp/server-4.2.asc | sudo apt-key add -`
	  If you receive an error indicating that `gnupg` is not installed, you can:
		 1. Install `gnupg` and its required libraries:  
		 `$ sudo apt-get install gnupg`  
		 `$ wget -qO - https://www.mongodb.org/static/pgp/server-4.2.asc | sudo apt-key add -`  
	       2. Create a list file for MongoDB  
	       `$ echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu bionic/mongodb-org/4.2 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.2.list`  
	       3.  Reload local package database  
	          `$ sudo apt-get update`  
	       4. Install the MongoDB packages  
	       `sudo apt-get install -y mongodb-org`  
							
## Package installation 
Run the following command to install Express and all other needed packages.
`$ npm install`

## Pre-requisites for running

 1. Run **Mongod** for the database server to be working:
 `$ mongod`
## Unit tests
To run unit tests without having a coverage test report, run the following command:
`$ npm test`
To run unit tests with code coverage, run the following command: 
`$ npm test_coverage`
## How to run for developers
To run for developers, run the following command:
`$ npm dev`
## How to run for production
To run for production, run the following command:
`$ npm start`
## Functional documentation generation
To generate functional documentation, runt the following command in the main directory:
`$ node_modules/jsdoc/jsdoc.js`
## API documentation generation
To generate API documentation, go to swagger and log-in. Then press the extract to button.



