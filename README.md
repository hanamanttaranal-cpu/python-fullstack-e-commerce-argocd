# Python Full Stack E-Commerce on AWS EKS with ArgoCD

## Overview

This project demonstrates the deployment of a Python Full Stack E-Commerce application on Amazon EKS using Kubernetes and ArgoCD. The infrastructure is provisioned using Terraform, containerized with Docker, and deployed automatically through GitOps using ArgoCD.

---

## Architecture

```
GitHub Repository
        │
        ▼
     ArgoCD
        │
        ▼
Amazon EKS Cluster
        │
 ┌──────┼──────────┐
 │      │          │
 ▼      ▼          ▼
Frontend Backend  MySQL
        │
        ▼
 Persistent Volume
```

---

## Tech Stack

* Python (FastAPI)
* MySQL
* Docker
* Kubernetes
* Amazon EKS
* Terraform
* ArgoCD
* AWS EBS CSI Driver

---

## Project Structure

```
python-fullstack-e-commerce-argocd/
│
├── kubernetes/
│   ├── backend-deployment.yaml
│   ├── backend-service.yaml
│   ├── frontend-deployment.yaml
│   ├── frontend-service.yaml
│   ├── mysql-deployment.yaml
│   ├── mysql-service.yaml
│   ├── mysql-pv.yaml
│   └── mysql-pvc.yaml
│
├── argocd/
│   ├── appproject.yaml
│   └── application.yaml
│
└── README.md
```

---

## Features

* Python FastAPI Backend
* MySQL Database
* Dockerized Application
* Kubernetes Deployments
* Persistent Storage using EBS
* Kubernetes Services
* GitOps Deployment with ArgoCD
* Automatic Synchronization
* Self-Healing
* Automatic Pruning

---

## Prerequisites

* AWS Account
* Amazon EKS Cluster
* kubectl
* Docker
* Terraform
* ArgoCD
* Git

---

## Clone Repository

```bash
git clone https://github.com/hanamanttaranal-cpu/python-fullstack-e-commerce-argocd.git

cd python-fullstack-e-commerce-argocd
```

---

## Deploy Kubernetes Resources

```bash
kubectl apply -f kubernetes/
```

Verify:

```bash
kubectl get pods

kubectl get svc

kubectl get pvc
```

---

## Install ArgoCD

```bash
helm repo add argo https://argoproj.github.io/argo-helm

helm repo update

kubectl create namespace argocd

helm install argocd argo/argo-cd -n argocd
```

---

## Create ArgoCD Project

```bash
kubectl apply -f argocd/appproject.yaml
```

---

## Create ArgoCD Application

```bash
kubectl apply -f argocd/application.yaml
```

---

## Verify Application

```bash
argocd app list

argocd app get python-application

kubectl get pods

kubectl get svc
```

---

## Kubernetes Resources

* Deployment
* Service
* PersistentVolume
* PersistentVolumeClaim

---

## ArgoCD Features Used

* AppProject
* Application
* Automated Sync
* Self Heal
* Prune
* GitOps Workflow

---

## Repository

```
https://github.com/hanamanttaranal-cpu/python-fullstack-e-commerce-argocd
```

---

## Learning Outcomes

* Infrastructure as Code using Terraform
* Docker Image Management
* Kubernetes Deployments
* Persistent Storage with EBS
* Service Discovery
* GitOps using ArgoCD
* Continuous Deployment on Amazon EKS

---

## Author

**Hanamant Taranal**

DevOps Engineer

Skills:

* AWS
* Docker
* Kubernetes
* Terraform
* Jenkins
* ArgoCD
* Python
* Linux
* Git







