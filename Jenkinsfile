pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-credentials')
        DOCKERHUB_USERNAME = 'naga2112'

        BACKEND_IMAGE = "${DOCKERHUB_USERNAME}/erp-crm-backend-jenkins"
        FRONTEND_IMAGE = "${DOCKERHUB_USERNAME}/erp-crm-frontend-jenkins"
        IMAGE_TAG = "${BUILD_NUMBER}"
    }

    stages {
        stage('Checkout from Bitbucket') {
            steps {
                echo "Checking out repository..."
                checkout scm
            }
        }

        stage('Build Docker Images') {
            parallel {

                stage('Build Backend Image') {
                    steps {
                        echo "Building backend Docker image..."
                        dir('backend') {
                            bat """
                                docker build -t ${BACKEND_IMAGE}:${IMAGE_TAG} ^
                                             -t ${BACKEND_IMAGE}:latest1 .
                            """
                        }
                    }
                }

                stage('Build Frontend Image') {
                    steps {
                        echo "Building frontend Docker image..."
                        dir('frontend') {
                            bat """
                                docker build -t ${FRONTEND_IMAGE}:${IMAGE_TAG} ^
                                             -t ${FRONTEND_IMAGE}:latest2 .
                            """
                        }
                    }
                }

            }
        }

        stage('Push to Docker Hub') {
            steps {
                echo "Logging into Docker Hub..."
                bat """
                    echo ${DOCKERHUB_CREDENTIALS_PSW} | docker login -u ${DOCKERHUB_CREDENTIALS_USR} --password-stdin
                """

                bat "docker push ${BACKEND_IMAGE}:${IMAGE_TAG}"
                bat "docker push ${BACKEND_IMAGE}:latest1"

                bat "docker push ${FRONTEND_IMAGE}:${IMAGE_TAG}"
                bat "docker push ${FRONTEND_IMAGE}:latest2"
            }
        }
    }

    post {
        always {
            echo "Cleaning Docker artifacts..."
            bat "docker logout || exit 0"
        }
        success {
            echo "Pipeline completed successfully!"
        }
        failure {
            echo "Pipeline failed!"
        }
    }
}
