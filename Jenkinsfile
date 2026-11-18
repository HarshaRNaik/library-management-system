pipeline {
    agent any
    triggers { pollSCM('* * * * *') }
    environment { CI = 'true' }

    stages {
        stage('Checkout') {
            steps { checkout scm }
        }
        stage('Install Dependencies') {
            steps {
                script {
                    if (isUnix()) { sh 'npm ci' } else { bat 'npm ci' }
                }
            }
        }
        stage('Automated Testing') {
            steps {
                script {
                    if (isUnix()) {
                        sh 'mkdir -p reports'
                        sh 'npm run test:ci -- --json --outputFile=reports/jest-results.json'
                    } else {
                        bat 'if not exist reports mkdir reports'
                        bat 'npm run test:ci -- --json --outputFile=reports/jest-results.json'
                    }
                }
            }
        }
        stage('Build / Validation') {
            steps {
                script {
                    if (isUnix()) {
                        sh 'npm run build'
                        sh 'mkdir -p artifacts && npm pack --pack-destination artifacts --cache .npm-cache'
                    } else {
                        bat 'npm run build'
                        bat 'if not exist artifacts mkdir artifacts'
                        bat 'npm pack --pack-destination artifacts --cache .npm-cache'
                    }
                }
            }
        }
        stage('Archive Artifacts') {
            steps {
                archiveArtifacts artifacts: 'reports/jest-results.json, artifacts/*.tgz', fingerprint: true
            }
        }
    }
    post {
        success { echo 'Library Management System CI completed successfully.' }
        failure {
            archiveArtifacts artifacts: 'reports/jest-results.json, artifacts/*.tgz', fingerprint: true, allowEmptyArchive: true
            echo 'Library Management System CI failed. Review the stage output and test report.'
        }
        always {
            echo 'Library Management System CI pipeline finished.'
        }
    }
}
