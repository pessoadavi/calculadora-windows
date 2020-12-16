class calculatorController {


    constructor(){
        this._display = document.querySelector("#display");
        this._memory =[];
        this._lastOperator;
        this._lastNumber;

        this.setDisplay = '0';
        this.initializeButtons();
        this.listenKeyUpButton();
    }

    listenKeyUpButton(){

        document.addEventListener('keyup', eventKeyBoard => {

            switch(eventKeyBoard.key){

                case 'Escape':
                    this.clearAll();
                    break;
                    
                case 'Backspace':
                    this.calcSpecialOperators('←');
                    break;
    
                case '+':
                        
                case '-':
                       
                case '*':
                   
                case '/':

                case '%':
                this.operations(eventKeyBoard.key);
                break;
                       
                case 'Enter':
                case '=':
                    this.calc();
                    break;
    
                case '.':

                case ',':
                    this.addDot();
                    break;
    
                case '0':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':                   
                case '8':
                case '9':
                    this.operations(parseInt(eventKeyBoard.key));
                    break;

                case 'c':
                if (eventKeyBoard.ctrlKey) { this.copyToClipBoard(); }
                break;

            }

        });
    }

    /* Método para ter acesso à área de tranferência para usode Cntrl C Cntrl V */
    copyToClipBoard() {

        let input = document.createElement('input');    // Cria de modo dinâmico o elemento na tela

        input.value = this.getDisplay;                  // Coloca do display on input
    
        document.body.appendChild(input);               // Ele insere o input no body do HTML

        input.select();                                 // Seleciona o conteúdo do input

        document.execCommand("Copy");                   // Copia para o SO o que está no input

        input.remove();

    } 

    listenClickButton(textButton){

        switch(textButton){

            case '%':
                this.operations('%');
            break;

            case '√':
                this.calcSpecialOperators('√');
            break;

            case 'x²':
                this.calcSpecialOperators('x²');
            break;

            case '¹/x':
                this.calcSpecialOperators('¹/x');
            break;

            case 'CE':
                this.clearAll();
            break;

            case 'C':
                this.clearEntry();
            break;

            case '←':
                this.calcSpecialOperators('←');
            break;

            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                this.operations(parseInt(textButton));
            break;

            
            case '±':
                this.calcSpecialOperators('±');
            break;

            case ',':
            case '.':
                this.addDot();
            break;

            case '+':
                this.operations('+');
            break;

            case '-':
                this.operations('-');
            break;

            case 'X':
                this.operations('*');
            break;

            case '÷':
                this.operations('/');
            break;

            case '=':
                this.calc();
            break;

            default:
            break ;
        }

    }

    /* Limpa tudo */
    clearAll(){
        this.clearInfo();
    }

    /* Limpa o útimo número da calculadora */
    clearEntry(){

        this._memory.pop();
        this.setLastNumberToDisplay();

        if(this._memory.length == 1 || this._memory.length == 0) {
           this.clearInfo();

        }
        console.log(this._memory);
    }

    /* Apresenta palavra erro */
    setError(){
        this.setDisplay = "ERROR";
    }

    /* Apaga os parâmetros */
    clearInfo(){
        this._memory = [];
        this.setDisplay = 0;
        this._lastNumber = '';
        this._lastOperator = '';
    }

    /* Trata dos números decimais */
    addDot(){

        let lastOperation = this.getLastItem(false)         // Armazena o último número

        if(typeof lastOperation === "string" && lastOperation.split('').indexOf('.') > -1){     // Verifica se é uma string e se dentro dessa string há um ponto
            return;
    
        }

        if(this.isOperator(lastOperation) || !lastOperation) {
            this.setPushNewValue('0.');
        } else {
            this.setCurrentValue(lastOperation.toString() + '.');
        }

        this.setLastNumberToDisplay();



    }

    /* Trata os botões especiais da calculadora */
    calcSpecialOperators(value){

        let currentNumber = '';
        currentNumber = this.getLastItem(false);                //Verifica se último item pé um número e armazena

        if(value == '√'){
            this.setCurrentValue(Math.sqrt(currentNumber));            

        }

        if(value == '±'){
            this.setCurrentValue(-1 * currentNumber);
        }

        if(value == 'x²'){
            this.setCurrentValue(Math.pow(currentNumber,2));
        }

        if(value == '¹/x'){
            if(currentNumber === 0){
                this.setError;
            } else {
                this.setCurrentValue(1/currentNumber);
            }
        }

        if(value == '←'){

            currentNumber /= 10;
            
            if(currentNumber < 1) {
                this._memory.pop();
            } else {
                this.setCurrentValue(Math.trunc(currentNumber));
            }
        }

        this.setLastNumberToDisplay();
        console.log(this._memory);

    }
    operations(value){

        if(isNaN(this.getLastOperation())){

            if(this.isOperator(value)){

                if(this._memory.length == 0 ) {
                    this._memory[0] = '0';
                    this.setPushNewValue(value);
                    
                }

                this.setCurrentValue(value);
                console.log(value);

            } else {
                this.setPushNewValue(value);
                this.setLastNumberToDisplay();

            }

        } else {
            if(this.isOperator(value)){
                this.setPushNewValue(value);

            } else {  

                let newValue = this.getLastOperation().toString() + value.toString();
                this.setCurrentValue(newValue);
                this.setLastNumberToDisplay();
            }

        }
        console.log(this._memory);

    }

    calc(){

        let last ='';

        this.setLastOperator = this.getLastItem(true);    // Toma o último operador da memória  pelo método

        if(this._memory.length < 3){

            let firstNumber = this._memory[0];
            this._memory = [firstNumber, this.getLastOperator, this.getLastNumber];
        
        } 
        

        if(this._memory.length > 3){

            last = this._memory.pop();
            this.setLastNumber = this.getResult();

        } else if (this._memory.length === 3) {
            
            if(this._memory[1] == "-" && this._memory[2] < 0) {
                this._memory[1] = '+';
                this._memory[2] = -1 * this._memory[2];  

            } 

            this.setLastNumber = this.getLastItem(false);

        }

        let result = this.getResult();

        if(last == '%'){
            result /= 100;
            this._memory = [result];
            console.log(this._memory);
        } else {
            this._memory = [result];
            console.log(this._memory);

        }

        if(last){
            this._memory.push(last);
        }

        this.setLastNumberToDisplay();

    }

    

    getLastItem(isOperator = true){

        let lastItem;

        for(let i = this._memory.length - 1 ; i>=0 ; i--){

            if(this.isOperator(this._memory[i]) == isOperator){

                lastItem = this._memory[i];
                break;
            }

        }

        if(!lastItem){
            lastItem = (isOperator) ? this.getLastOperator : this.getLastNumber;
        }

        return lastItem;
    }

    /* Une os caracteres (join) e gera uma única string (eval) */
    getResult(){
        return eval(this._memory.join(""));
    }
    
    /* Escreve os números na calculadora */
    setLastNumberToDisplay(){

        let lastNumber = this.getLastItem(false);   // Verifica se o último item é número

        if(!lastNumber) lastNumber = 0;             // Caso seja falso ele imprime zero

        this.setDisplay = lastNumber;               // Aloca o valor na variável
        
    }


    /* Insere o valor na memória quando digitado */
    setPushNewValue(value){
        this._memory.push(value);                  // Método que insere um novo valor na memória

        if(this._memory.length > 3){               // memória tiver 4 itens chama o referido método 
            this.calc();
        }

    }

    /* Toma o registro mais recente da memória e o aloca no mesmo local*/
    setCurrentValue(value){
        this._memory[this._memory.length - 1] = value;
    }

    /* Verifica se o item na memória é um operador */
    isOperator(operador) {
        return (['+','-','*','/','%'].indexOf(operador) > -1);  // Retorna true para resultado = 1 > -1 
    }
    
    /* Toma o último valor do array */
    getLastOperation(){
        return this._memory[this._memory.length -1];
    }

    
    initializeButtons(){

        let buttons = document.querySelectorAll("#row1 > button, #row2 > button, #row3 > button, #row4 > button, #row5 > button, #row6 > button");

        buttons.forEach((btn, index) => {
            btn.addEventListener('click', events =>{
                this.listenClickButton(btn.value);
                

            });

            this.addEventListenerAll(btn ,'mouseup mouseover mousedown', events =>{

                btn.style.cursor = "pointer";
            });
        });
        
    }

    addEventListenerAll(elements, events, fnctn){

        events.split(' ').forEach(event => {
            elements.addEventListener(event, fnctn, false);
        });
    }

    
    get getDisplay(){
        return this._display.innerHTML;
    }

    set setDisplay(_display){

        if(_display.toString().length > 10) {
            this.setError();
            return false;
        }
        this._display.innerHTML = _display;
    }

    get getMemory(){
        return this._memory;
    }

    set setMemory(_memory){
        this._memory = _memory;
    }

    get getLastOperator(){
        return this._lastOperator;
    }

    set setLastOperator(_lastOperator){
        this._lastOperator = _lastOperator;
    }

    get getLastNumber(){
        return this._lastNumber;
    }

    set setLastNumber(_lastNumber){
        this._lastNumber = _lastNumber;
    }
}