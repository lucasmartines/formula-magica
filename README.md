# Fórmula Magica Joel Greenblat para ações brasileiras

![](https://zgrp9w.bl.files.1drv.com/y4mPw_sPsbnqnP9Oh44IyUz2PHmECeUKpzRsq624kJdsm_lkeKuSO8x5cyXYeLNoIDEuATeBrOOnZ8s-mlc3TNMfZMUER0TRRoN7RLTguPAlGNqyT8vu23R5-c_rIQYmg3VhbDA-sWHs8bq9L9q84LNmLwzz1y39bPvxfAcmcfvdm5mb8DixzEoRfDBDOqfvfHzFmyAAAYH4AhEnxQ0ypBaNg?width=1024&height=467&cropmode=none)


## Resumo
A formula mágica de greenblat é uma técnica que permite ranquear ações mais rentaveis a um preço mais baixo, ou seja
ações que possivelmente o mercado não esteja valorizando muito agora, mais por serem rentaveis o mercado irá valorizar.

O ranquing utiliza os indicadores EV/Ebit e ROIC para gerar o Earning Yield

Se um ativo tem o EV/Ebit baixo quer dizer que está mais barato, 
se o Roic é alto quer dizer que a empresa está gerando bastante dinheiro

Unificando os dois significa que a empresa está indo bem mas o mercado ainda não reconheceu isso no preço.

## Tutorial Para rodar o app
### Primeiro Instale as dependências
```
npm install
```
### Para rodar localmente na porta 3000
```
npm run serve
```

### Para rodar em um servidor de produção
```
npm run prod
```

### Para parar no servidor de produção
```
npm run stop
```
## Como funciona?
Basicamente o software faz web scralping ou seja ela vai no site fundamentos e pega os dados base de lá.
Depois os dados são expostos em uma api na rota
```
/api/ranking/magic
```

## Tecnologías
    Node
    Cherrio
    Crawler