# Choice of hosting solution: Heroku

## 1. Context

The Legacy project requires a hosting solution that allows:
- access via the Internet
- a simple and quick deployment
- sufficient availability for users
- a controlled cost
- standard security for a web application

The client's constraints are:
- limited budget
- need for management simplicity
- possibility of evolution (scalability)
- acceptable quality of service


## 2. Chosen solution :

Heroku is a PaaS (Platform as a Service) hosting platform that allows you to deploy an application without directly managing the servers.


## 3. Justification of the choice

### 3.1 Budget

- Pricing adapted to small-scale projects
- No cost related to server administration
- Payment based on resources used

→ Meets the budget constraint

---

### 3.2 Deployment simplicity

- Automated deployment via Git
- Environment already configured for web applications
- Simple integration with a database (PostgreSQL)

→ Meets the simplicity requirement

---

### 3.3 Scalability

- Ability to increase resources (dynos)
- Suitable for gradual scaling up

→ Meets the scalability requirement

---

### 3.4 Availability and Quality of Service

- Cloud infrastructure managed by Heroku
- Automatic restart in case of a problem
- Access to logs and metrics

→ Meets the quality of service requirement.

---

### 3.5 Security

- Secure management of environment variables
- HTTPS support
- Application isolation

→ Meets the security requirement.

## 4. Conclusion

The choice of Heroku is justified because it allows:
- a simple hosting
- a rapid deployment
- a proper availability
- appropriate security
- a possible evolution of resources
while respecting the client's constraints (budget, security, scalability, quality of service)
