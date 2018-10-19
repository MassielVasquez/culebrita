'use strict';

window.addEventListener('load', init);
document.addEventListener('keydown', readKey);

var canvas; //= document.querySelector('#canvas'); // encapsula una etiqueta html en una variable js
var ctx; //= canvas.getContext('2d');
var lastkey;
var body = new Array();
var keys = {UP:38, RIGHT:39, DOWN:40, LEFT:37, ENTER:13};
var pause = true;
var food;
var eat;
var die;
var collision = 0;
var speed = 200;  //la comida entre mas grade mas lento
var contador = 8; //para poder contar a cada cuanto los obstaculos van a aparecer

var dir = 1;
var obtaculo = new Array(); //variable para poder colocar nuevos obtaculos

//variable para poder realizar los niveles
var nivel = 1;

//adiciones 
var bloque = new Array(); // variable que sirve para poder mover los obstaculos de arriba hacia abajo
var bloque2 = new Array(); // variable que sirve para poder mover los obstaculos de  isquierda a derecha
var velocidadaleatoria = new Array(); //
var velocidadaleatoria2= new Array(); //


function init ()
{
	canvas = document.querySelector('#canvas');
	ctx = canvas.getContext('2d');

	eat = new Audio();
	die = new Audio();

	eat.src = 'assets/chomp.oga';
	die.src = 'assets/dies.oga';

	
	

	//valdacion para saber sihay datos en local storage

	if('guardado' in localStorage)
	{
		console.log('Estoy en algo guardado');
		cargar();
		localStorage.removeItem('guardado');

	}else{
		console.log('no estoy en algo guardado');
		localStorage.setItem('guardado',true);
		Reinicio();
	}

	move();
	rePaint();
	var acum = 0;
	var x = 5;
	var y = 20;
	// para poder mover los bloques de arriba hacia abajo
	for (let i = 0; i < 12; i++) {
		// let x = random(canvas.width/10 -1 )*10;

		// //ramdom y
		// bloque.push(new Rectangle(x,10,10,10,'#FFF','assets/head.png'));
		// let vl= random(100/10 -1);
		// if (vl ==0)
		// {
		// 	vl = 1;
		// }
		// let x= acum + 1;
		x += 10;
		bloque.push (new Rectangle(x,10,10,10,'#fff','assets/head.png')); 
		x += 5;
		
	}

	for (let i = 0; i < 12; i++) {
		y+=10;
		bloque2.push(new Rectangle(10,y,10,10,'#fff','assets/body.png'));
		y +=10;
		
	}

}

function paint ()
//se encarga de pintar todo el cuadro principal
{
	 // Fondo
	 ctx.fillStyle = '#000';
	 ctx.fillRect(0, 0, canvas.width, canvas.height);


	 ctx.fillStyle = '#fff'
	 // variable.tipo de variable (texto + variable x,y posicion)
	

	 food.paintImage(ctx);


	 //Para poder pintar cada obtaculo
	 for (let i=0; i<obtaculo.length; i++)
	 	obtaculo[i].paintImage(ctx);

	 // contraste (cuadro blanco)
	 for (let i=0; i<body.length; i++)
		 body[i].paintImage(ctx);
		 
		 //para poder poner el mensaje de pause

	if(pause)
	{
		
		ctx.font ='40px arial';
		ctx.fillText('PAUSA',90,120);
	}else{
		ctx.font ='15px arial';
		ctx.fillText('Key: ' + lastkey, 20, 30);
		ctx.fillText('collision:' + collision, 100, 30);
		ctx.fillText('Nivel:'+nivel,180,30);
	}

	//parapoder pintar los bloques  de arriba asia abajo
	for (let i = 0; i < bloque.length; i++) {
		bloque[i].paintImage(ctx);
		
	}

	//parapoder pintar los bloques  de isquierda a derecha
	for (let i = 0; i < bloque2.length; i++) {
		bloque2[i].paintImage(ctx);
		
	}


}

function rePaint ()
//se encarga de pintar  el movimiento para que este se actualice
{
	requestAnimationFrame(rePaint);;
	
	paint();
}

function move ()
{
	setTimeout(move, speed);
	setDirection();
}

function setDirection ()
{
	


	// Verificar colision con la comida
	
	if (lastkey == keys.ENTER)
	{
		pause = !pause;
		lastkey = null;
	}

	if (!pause)
	{

		// Instaciar obtaculos cada 8 obtaculos

		if (collision == contador){
			
			for (var i = 0; i < 2 ; i++) {
				// para poder sacar el ramdom del obstaculo para que no salga en un solo lugar
				let x = random(canvas.width / 10 - 1) * 10;
				let y = random(canvas.height / 10 - 1) * 10;

			obtaculo.push(new Rectangle(x,y,10,10,'#fff','assets/body.png'));
				
			}
			
			contador +=8;  //se le vuelve a recordar cada cuantas colisiones
			console.log('se ha creado un nuevo obstaculo');
		}


		//colllion con obstaculo
		for (var i = 0; i < obtaculo.length; i++) {
			if (body[0].intersects(obtaculo[i]))
			{
				//si colisiona con algun obstaculo
				//que pierda una parte del cuerpo

				//pop elimina el ultimo elemento del arreglo
				body.pop();
				//body.legth para medir la logitud del arreglo
				console.log(body.length);
				if(body.length < 4){
					console.log('haz muerto');
					pause = !pause;
					lastkey = null;
					Reinicio();
					die.play();
				}
				
			}
			
		}

		// Colision con el mismo cuerpo
			for (let i = 4; i < body.length; i++)
			{
				if (body[0].intersects(body[i]))
				{
					Reinicio();
					console.log('COLISION CON EL CUERPO');
					die.play();
					
				}

			}


		// verificar colision con la comida
		if (body[0].intersects(food))
		{
			body.push(new Rectangle(food.x, food.y, 10, 10, '#fff', 'assets/body.png'))
			food.x = random(canvas.width / 10 - 1) * 10;
			food.y = random(canvas.height / 10 - 1) * 10;
				///10-1 *10 es para que no pinte afuera
			eat.play();

			// aumentar las coliciones  y darle los niveles
			collision += 1;

			if (collision == 5)
			{
				speed -= 5;
				nivel = 2;
			}
				
			else if (collision == 10)
			{
				speed -= 5;
				nivel = 3;
			}
				
			else if (collision == 15)
			{
				speed -=5;
				nivel = 4;
			}
				
			else if (collision == 20)
			{
				speed -=5;
				nivel = 5;
			}
				
			else if (collision == 25)
			{
				speed -=10;
				nivel =6;
			}

		}
		//para detectar en que posicion se encuentra la culebra en el moviento
		//console.log(`X:${body[0].x} Y:${body[0].y}`);
		
		if (nivel ==6){
			console.log('nivel 6 si colisionas con las paredes mueres');
				if ((body[0].x >= 0 && body[0].y ==0) || //para validar que muera  x + 0 y y = 0
				(body[0].x == 0 && body[0].y >=0) || //para validar que muera  x = 0 y y + 0
				(body[0].x == 290 && body[0].y >=0) || //para validar que muera  x = 290 y y + 0
				(body[0].x >=0 && body[0].y ==290))
				{
					console.log('haz muerto');
					Reinicio();

				}

		}
		
		//PAra que el cuerpo siga a la cabeza 
		for (let i = body.length -1; i>0; i--)
		{
			body[i].x = body[i - 1].x;
			body[i].y = body[i - 1].y;
		}

		//Para dar direccion al cuerpo (sin que regrese sobre si mismo)
		if (lastkey == keys.UP && dir != 2)
			dir = 0;
		if (lastkey == keys.RIGHT && dir != 3)
			dir = 1;
		if (lastkey == keys.DOWN && dir != 0)
			dir = 2;
		if (lastkey == keys.LEFT && dir != 1)
			dir = 3;


		if (dir == 0)
			body[0].y -= 10;
		if (dir == 1)
			body[0].x += 10;
		if (dir == 2)
			body[0].y += 10;
		if (dir == 3)
			body[0].x -= 10;

		//Para regresar el cuerpo en el sentido opuesto
		if (body[0].x > canvas.width)
			body[0].x = -10;
		if (body[0].x + body[0].w < 0)
			body[0].x = canvas.width;
		if (body[0].y > canvas.height)
			body[0].y = -10;
		if (body[0].y + body[0].h < 0)
			body[0].y = canvas.height;

			//para poder hacer que los bloqus se muevan de arriba acia abajo 


			for (let i = 0; i < bloque.length; i++) {

				let movimientorandom= random(10);
				while (movimientorandom >= 0 && movimientorandom <3)
				{
					movimientorandom= random(10);
				}
				velocidadaleatoria.push(movimientorandom);
				bloque[i].y +=velocidadaleatoria[i];

				if (bloque[i].y >300 )
				{
					bloque[i].y = 0;
				}
				
				
			}

			//para poder hacer que los bloqus se muevan de  isquierda a derecha
			for (let i = 0; i < bloque2.length; i++) {
				
				let movimientorandom= random(10);
				while (movimientorandom >= 0 && movimientorandom <3)
				{
					movimientorandom= random(10);
				}
				velocidadaleatoria2.push(movimientorandom);
				bloque2[i].x +=velocidadaleatoria2[i];

				if (bloque2[i].x >290 )
				{
					bloque2[i].x = 0;
				}
			}

			//detectar collliones con los obstaculos de arriba hacia abajo

			for (let i = 0; i < bloque.length; i++) {

				if(body[0].intersects(bloque[i]))
				{
					Reinicio();
					die.play();
				}
				
			}

			//detectar collliones con los obstaculos de arriba hacia abajo

			for (let i = 0; i < bloque2.length; i++) {

				if(body[0].intersects(bloque2[i]))
				{
					Reinicio();
					die.play();
				}
				
			}


	}

	// utilizamos el local storage para poder guardar ls datos


	localStorage.setItem('collision',collision);
	localStorage.setItem('nivel',nivel);
	localStorage.setItem('contador',contador);
	localStorage.setItem('body',JSON.stringify(body));
	localStorage.setItem('obtaculo',JSON.stringify(obtaculo));
	
	console.log('puntos: '+localStorage.getItem('collision'));


	

}

function Reinicio(){

	//spice es para eliminar un arreglo desde un punto de partidad (primernumero,cuantos elementos eliminara)
	body.splice(0,body.length);
	obtaculo.splice(0,obtaculo.length);
	collision=0;
	contador=8;
	//armadado de la culebra 
	body.push(new Rectangle(50,50,10,10,'#ffa','assets/head.png'));
	body.push(new Rectangle(40,50,10,10,'#fff','assets/body.png'));
	body.push(new Rectangle(30,50,10,10,'#fff','assets/body.png'));
	body.push(new Rectangle(20,50,10,10,'#fff','assets/body.png'));

	let x = random(canvas.width/10 -1) *10;
	let y = random(canvas.height/10-1)*10;
	food =new Rectangle(x,y,10,10,'#F0291D','assets/fruit.png');



	console.log('Tu juego se Reinicio por muerte');
	
	pause = true;
	nivel =1;
	

}

function cargar()
{
	//spice es para eliminar un arreglo desde un punto de partidad (primernumero,cuantos elementos eliminara)
	body.splice(0,body.length);
	obtaculo.splice(0,obtaculo.length);
	collision = localStorage.getItem('collision'); //buscar la variable que esta guardada
	contador=localStorage.getItem('contador');



	let cargarbody = new Array();
	cargarbody = JSON.parse(localStorage.getItem('body'));


	for (let i = 0; i < cargarbody.length; i++) {
		body.push(new Rectangle(cargarbody[i].x,cargarbody[i].y, cargarbody[i].w, cargarbody[i].h,cargarbody[i].c,cargarbody[i].src));
		
	}
	
	let cargarObstaculo = new Array();
	cargarObstaculo  = JSON.parse(localStorage.getItem('obtaculo'));
	console.log(cargarObstaculo);
	for (let i = 0; i < cargarObstaculo.length; i++) {
		obtaculo.push(new Rectangle(cargarObstaculo[i].x,cargarObstaculo[i].y,cargarObstaculo[i].w,cargarObstaculo[i].h,cargarObstaculo[i].c,cargarObstaculo[i].src));
	}

	

	let x = random(canvas.width/10 -1) *10;
	let y = random(canvas.height/10-1)*10;
	food =new Rectangle(x,y,10,10,'#F0291D','assets/fruit.png');



	console.log('Tu juego se Reinicio por muerte');
	
	pause = true;
	nivel = localStorage.getItem('nivel');
}

function readKey (e)
{
	lastkey = e.keyCode || e.wich; // obtiene el codigo ascii de la tecla presionada
}

function random (size)
{
	return Math.floor(Math.random() * size);
}

// clase para repintar el cuadrito blanco
function Rectangle (x, y, w, h, c, src = '')
{
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.c = c;
	this.src = src;

	this.body = new Image();
	this.body.src = src;
	this.body.onload = this.paintImage;

	this.paintImage = function (context)
	{
		context.drawImage(this.body, this.x, this.y);
	}

	this.fill = function (context)
	{
		context.fillStyle = this.c;
		context.fillRect(this.x, this.y, this.w, this.h);
	}

	this.intersects = function (obj)
	{
		return (this.x + this.w) > obj.x &&
			   this.x < (obj.x + obj.w) &&
			   (this.y + this.h) > obj.y &&
			   this.y < (obj.y + obj.h)
	}
}

/*
	1. Agregar dos obstaculos cada 8 colisiones
	2. Resetear el juego cuando colisione con el cuerpo
	3. Corregir el aumento de velocidad
	4. Definir solo 6 niveles
	5. En el nivel 6: No colisionar con las paredes

	INVESTIGACION
	Agregar localstorage para almacenar niveles
*/