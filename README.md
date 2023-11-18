

## Instalação

```bash
$ npm install
```

## Configurando docker

```bash
$ docker compose up (com sudo se estiver no linux)
```

## Iniciando o app

```bash

$ npx prisma migrate dev
$ npm run start
```

## Acessando a documentação com Swagger
Para acessar o Swagger entre no localhost:3000/api

## Autenticação
Alguns endpoints utilizam autenticação, ela funciona com o padrão Bearer e estão marcados na descrição do Swagger

## Dump
Não criei um dump especifico pois não sei fazer isso, mas aqui esta alguns dados que você pode utilizar para criar usuários

```javascript
[
 {
            "name": "Pessoa bacana",
            "email": "email@emaila.com",
            "hashedPassword": "senhaforte",
            "role": "SELLER"
        },
        {
            "name": "Pessoa muito louca",
            "email": "email@emailb.com",
            "hashedPassword": "senhaforte",
            "role": "SELLER"
        },
        {
            "name": "aluno nota 10",
            "email": "eu@mesmo.com",
            "hashedPassword": "senhaforte",
            "role": "ADMIN"
        }
]
```

## Database
Se quiser dar alguma olhada na database, pode acessar um visualizador simples utilizando do comando

```bash 

npx prisma studio
```
