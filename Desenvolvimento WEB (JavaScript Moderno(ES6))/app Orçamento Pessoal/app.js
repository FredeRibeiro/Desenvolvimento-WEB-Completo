class Despesa {
    constructor(ano, mes, dia, tipo, descricao, valor) {
        this.ano = ano
        this.mes = mes
        this.dia = dia
        this.tipo = tipo
        this.descricao = descricao
        this.valor = valor
    }

    validarDados(){
        for (let i in this) {
            if(this[i] == undefined || this[i] == '' || this[i] == null){
                return false
            }                        
        }
        return true
    }
}

class Bd {

    constructor() {
        let id = localStorage.getItem('id')

        if (id === null) {
            localStorage.setItem('id', 0)
        }
    }

    getProximoId() {
        let proximoId = localStorage.getItem('id')
        return parseInt(proximoId) + 1
    }

    gravar(d) {
        let id = this.getProximoId()

        localStorage.setItem(id, JSON.stringify(d))

        localStorage.setItem('id', id)
    }

    recuperarTodosRegistros(){

        //array de despesas
        let despesas = Array()
        let id = localStorage.getItem('id')

        //recuperar as despesas cadastradas em localstorage
        for(let i = 1; i <= id ; i++){

            //recuperar despesa
            let despesa = JSON.parse(localStorage.getItem(i))
            
            //existe a possibilidade de haver indices que foram removidos
            //pular indices nullos

            if (despesa === null) {
                continue
            }
            
            despesa.id = i
            despesas.push(despesa)
        }

        return despesas
        
    }

    pesquisar(despesa){
       let despesasFiltradas = Array()

        despesasFiltradas = this.recuperarTodosRegistros()

        //ano
        if (despesa.ano != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano)
        }
        
        //mes
        if (despesa.mes != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes)
        }
        //dia
        if (despesa.dia != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia)
        }
        //tipo
        if (despesa.tipo != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo)
        }
        //descricao
        if (despesa.descricao != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesa.descricao)
        }
        //valor
        if (despesa.valor != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesa.valor)
        }

        return despesasFiltradas
        
    }

    remover(id){
        localStorage.removeItem(id)
    }
}

let bd = new Bd()


function cadastrarDespesa() {

    let ano = document.getElementById('ano')
    let mes = document.getElementById('mes')
    let dia = document.getElementById('dia')
    let tipo = document.getElementById('tipo')
    let descricao = document.getElementById('descricao')
    let valor = document.getElementById('valor')

    let despesa = new Despesa(
        ano.value,
        mes.value,
        dia.value,
        tipo.value,
        descricao.value,
        valor.value
    )

    if(despesa.validarDados()){
        bd.gravar(despesa)       
        //Mensagem de sucesso               
        $('#modalRegistraDespesa').modal('show')

        ano.value = ''
        mes.value = ''
        dia.value = ''
        tipo.value = ''
        descricao.value = ''
        valor.value = ''
        
    }else {
        //Mensagem de erro
        document.getElementById('modalTitulo').innerHTML = 'Erro na Gravação!'
        document.getElementById('modalCabecalho').className = 'modal-header text-danger'
        document.getElementById('modalConteudo').innerHTML = 'Existem campos obrigatórios que não foram preenchidos.'
        document.getElementById('modalBotao').className = 'btn btn-danger'
        document.getElementById('modalBotao').innerHTML = 'Voltar e Corrigir'
        $('#modalRegistraDespesa').modal('show')        
    }

}

function carregarListaDespesa(despesas = Array(), filtro = false) {

    if (despesas.length == 0 && filtro == false) {
        despesas = bd.recuperarTodosRegistros()
    }    

    //Selecionando o <tbody>
    let listaDespesas = document.getElementById('listaDespesas')

    listaDespesas.innerHTML = ''
    
    //Percorrendo array despesas, listando de forma dinamica

    despesas.forEach(function (d) {
       //Criando <tr>
       let linha = listaDespesas.insertRow()     
       
       //Criar as colunas <td>
        linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`        

        //ajustar o tipo
        switch (d.tipo) {
            case '1': 
                d.tipo = 'Alimentação'                
                break;
            case '2':
                d.tipo = 'Educação'
                break;
            case '3':
                d.tipo = 'Lazer'
                break;
            case '4':
                d.tipo = 'Saúde'
                break;
            case '5':
                d.tipo = 'Transporte'
                break;
            case '6':
                d.tipo = 'Livros'
                break;
        }

        linha.insertCell(1).innerHTML = d.tipo
        linha.insertCell(2).innerHTML = d.descricao
        linha.insertCell(3).innerHTML = `R$ ${d.valor}`

        //criando botão dentro da tabela
        let btn = document.createElement("button")
        btn.className = 'btn btn-danger'
        btn.innerHTML = '<i class="fas fa-times"></i>'
        btn.id = `id_despesa_${d.id}`
        //remover despesa
        btn.onclick = function () {
            
             let id = this.id.replace('id_despesa_','')

            bd.remover(id)

            window.location.reload()
        }
        linha.insertCell(4).append(btn)

        console.log(d);
        
    })
    
}

function pesquisarDespesa() {
    let ano = document.getElementById('ano').value
    let mes = document.getElementById('mes').value
    let dia = document.getElementById('dia').value
    let tipo = document.getElementById('tipo').value
    let descricao = document.getElementById('descricao').value
    let valor = document.getElementById('valor').value

    let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor)

    let despesas = bd.pesquisar(despesa)

    carregarListaDespesa(despesas, true)
}