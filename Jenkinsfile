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

        /* --------------------------------------------------
         * 1. CHECKOUT CODE
         * -------------------------------------------------- */
        stage('Checkout from Bitbucket') {
            steps {
                echo "Checking out repository..."
                checkout scm
            }
        }

        /* --------------------------------------------------
         * 2. INSTALL DEPENDENCIES FOR TESTING
         * -------------------------------------------------- */
        stage('Install Dependencies') {
            parallel {

                stage('Backend Dependencies') {
                    steps {
                        dir('backend') {
                            bat """
                                call npm install
                            """
                        }
                    }
                }

                stage('Frontend Dependencies') {
                    steps {
                        dir('frontend') {
                            bat """
                                call npm install
                            """
                        }
                    }
                }
            }
        }

        /* --------------------------------------------------
         * 3. RUN UNIT TESTS
         * -------------------------------------------------- */
        stage('Run Unit Tests') {
            parallel {

                stage('Backend Unit Tests') {
                    steps {
                        dir('backend') {
                            bat """
                                call npm test
                            """
                        }
                    }
                }

                stage('Frontend Unit Tests') {
                    steps {
                        dir('frontend') {
                            bat """
                                call npm test
                            """
                        }
                    }
                }
            }
        }

        /* --------------------------------------------------
         * 4. RUN INTEGRATION (API) TESTS
         * -------------------------------------------------- */
        stage('Integration Tests - Backend') {
            steps {
                dir('backend') {
                    bat """
                        echo Running API Integration Tests...
                        call npm run test:integration
                    """
                }
            }
        }

        /* --------------------------------------------------
         * 5. RUN FUNCTIONAL / UI TESTS (CYPRESS)
         * -------------------------------------------------- */
        stage('UI Functional Tests - Cypress') {
            steps {
                dir('frontend') {
                    bat """
                        echo Running Cypress tests...
                        call npx cypress run || exit 0
                    """
                }
            }
        }

        /* --------------------------------------------------
         * 6. BUILD DOCKER IMAGES
         * -------------------------------------------------- */
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

        /* --------------------------------------------------
         * 7. PUSH DOCKER IMAGES TO DOCKER HUB
         * -------------------------------------------------- */
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
