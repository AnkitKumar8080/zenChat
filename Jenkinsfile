pipeline {
  agent any

  environment {
    DOCKER_IMAGE_NAME = "zenchatbackend"
    DOCKER_CONTAINER_NAME = "zenchatbackend"
    VERSION_COMMIT_HASH = sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim() // versioning the build images
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    // Check for changes in the backend directory; if found, build it, else skip the build 
    stage('Checking for changes in the backend directory') {
      steps {
        script {
          def changes = sh(script: 'git diff --name-only HEAD HEAD~1', returnStdout: true).trim()

          if (!changes.contains("backend/") && !changes.contains("Jenkinsfile")) {
            currentBuild.result = 'SUCCESS'
            error("No changes found in the backend directory, skipping build.")
          }
        }
      }
    } 

    stage('Building Backend') {
      steps {
        sh "docker build -t ${DOCKER_IMAGE_NAME}:${VERSION_COMMIT_HASH} ./backend"
      }
    }

    // Stop and remove old container
    stage('Removing old container') {
      steps {
        script {
          // Search for the existing container 
          def containerExists = sh(script: "docker ps -a -q -f name=${DOCKER_CONTAINER_NAME}", returnStdout: true).trim()

          if (containerExists) {
            sh "docker stop ${DOCKER_CONTAINER_NAME}"
            sh "docker rm ${DOCKER_CONTAINER_NAME}"
          }
        }
      }
    }

    // Loading environment variables 
    stage('creating .env file') {
      steps {
        script {
          withCredentials([string(credentialsId: 'ZENCHAT_DB_URL', variable: 'DB_URL'), string(credentialsId: 'ZENCHAT_JWT_SECRET_KEY', variable: 'JWT_SECRET_KEY')]) {
            def envContent = """
            NODE_ENV=development
            PORT=5000
            CORS_URL=https://zenchat-indol.vercel.app
            SERVER_URL=https://zenchatapi.bytenode.xyz
            DB_URL=${DB_URL}
            DB_NAME=ZenChat
            DB_MIN_POOL_SIZE=2
            DB_MAX_POOL_SIZE=5
            COOKIE_VALIDITY_SEC=172800
            ACCESS_TOKEN_VALIDITY_SEC=182800
            REFRESH_TOKEN_VALIDITY_SEC=604800
            TOKEN_ISSUER=api.zenchat.com
            TOKEN_AUDIENCE=zenchat.com
            JWT_SECRET_KEY=${JWT_SECRET_KEY}
            """

            writeFile file: '.env', text: envContent
          }
        }
      }
    }

    // Run the docker container
    stage('Spinning up docker container') {
      steps {
        sh "docker run -d --restart unless-stopped --name ${DOCKER_CONTAINER_NAME} -p 5000:5000 --env-file .env ${DOCKER_IMAGE_NAME}:${VERSION_COMMIT_HASH}"
      }
    }
  }
}
