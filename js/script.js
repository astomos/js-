// ゲーム要素の設定

// プレイヤーの位置
let player0 = 0;
let player1 = 0;

// 表示されているサイコロの目
let diceValue0 = 0;
let diceValue1 = 0;

// 30マス進んだら勝ちとする
let goal = 30;

// ボタン等の設定
let $start = document.getElementById('start');
let $rollDice = document.getElementById('roll-dice');
let $can = document.getElementById('canvas');

if ($start) {
    $start.addEventListener('click', Start);
}
if ($rollDice) {
    $rollDice.addEventListener('click', RollDice);
}
if ($can) {
    $can.width = 640;
    $can.height = 640;
}
let ctx = $can.getContext('2d');

// サイコロの画像
let image1 = new Image(32, 32);
image1.src = 'img/dice01.png';
let image2 = new Image(32, 32);
image2.src = 'img/dice02.png';
let image3 = new Image(32, 32);
image3.src = 'img/dice03.png';
let image4 = new Image(32, 32);
image4.src = 'img/dice04.png';
let image5 = new Image(32, 32);
image5.src = 'img/dice05.png';
let image6 = new Image(32, 32);
image6.src = 'img/dice06.png';

// プレイヤーの画像
let imagePlayer0 = new Image(32, 32);
imagePlayer0.src = 'img/chara_yusha.png';
let imagePlayer1 = new Image(32, 32);
imagePlayer1.src = 'img/chara_monster_mao.png';

let imageShiro = new Image(32, 32);
imageShiro.src = 'img/map_shiro.png';

// サウンドの設定
let walkSound = new Audio('sound/walk.mp3');
let diceSound = new Audio('sound/start.mp3');
let winSound = new Audio('sound/win_game.mp3');
let loseSound = new Audio('sound/lose.mp3');

// マスの大きさ
let squareSize = 64;

// キャラクターとマスをどれだけずらして描画するか
let shift0 = 0;
let shift1 = 0;
// 歩いた時の更新回数
let walkUpdateCount0 = 1;
let walkUpdateCount1 = 1;
// ゲーム要素の設定完了

// ゲーム機能の設定

// 開始した時の関数
function Start(){
	$start.style.display = 'none';
	$rollDice.style.display = 'block';
	shift0 = 0;
	shift1 = 0;
	player0 = 0;
	player1 = 0;
	diceValue0 = 0;
	diceValue1 = 0;
	DrawField();
};
// 終了した時の関数
function Finish(){
	$start.style.display = 'block';
	$rollDice.style.display = 'none';
};


function DrawField(){
	let baseYPosPlayer0 = $can.height / 2 - 40;
	let baseYPosPlayer1 = $can.height / 2 + 40 + squareSize;

	ctx.fillStyle = '#000';
	ctx.fillRect(0, 0, $can.width, $can.height);

	ctx.font = '14px MS ゴシック';
	for(let i=0; i<=goal; i++){
		ctx.fillStyle = '#0cc';
		ctx.fillRect(50 * i + 50  - shift0, baseYPosPlayer0, squareSize, 8);
		ctx.fillStyle = '#fff';
		if(i == 0)
			ctx.fillText('START',  50 * i + 50  - shift0, baseYPosPlayer0 + 25);
		else if(i == goal)
			ctx.fillText('GOAL',  50 * i + 50  - shift0, baseYPosPlayer0 + 25);
		else
			ctx.fillText(i,  50 * i + 60  - shift0, baseYPosPlayer0 + 25);
	}

	for(let i=0; i<=goal; i++){
		ctx.fillStyle = '#0cc';
		ctx.fillRect(50 * i + 50  - shift1, baseYPosPlayer1, squareSize, 8);
		ctx.fillStyle = '#fff';
		if(i == 0)
			ctx.fillText('START',  50 * i + 50  - shift1, baseYPosPlayer1 + 25);
		else if(i == goal)
			ctx.fillText('GOAL',  50 * i + 50  - shift1, baseYPosPlayer1 + 25);
		else
			ctx.fillText(i,  50 * i + 60  - shift1, baseYPosPlayer1 + 25);
	}
	let charSize = 48;
	if(walkUpdateCount0 < 5)
		ctx.drawImage(imagePlayer0, 42, baseYPosPlayer0 - charSize - 8 * walkUpdateCount0, charSize, charSize);
	else
		ctx.drawImage(imagePlayer0, 42, baseYPosPlayer0 - charSize - 8 * (9-walkUpdateCount0), charSize, charSize);

	if(walkUpdateCount1 < 5)
		ctx.drawImage(imagePlayer1, 42, baseYPosPlayer1 - charSize - 8 * walkUpdateCount1, charSize, charSize);
	else
		ctx.drawImage(imagePlayer1, 42, baseYPosPlayer1 - charSize - 8 * (9-walkUpdateCount1), charSize, charSize);

	ShowDice(diceValue0, 160, baseYPosPlayer0 - 64, 40, 40);
	ShowDice(diceValue1, 160, baseYPosPlayer1 - 64, 40, 40);
}

setTimeout(()=>{
	DrawField();
}, 100);

function ShowDice(value, x, y, w, h){
	let images = [image1, image2, image3, image4, image5, image6, ];
	if(value - 1 >= 0 && images.length >= value)
		ctx.drawImage(images[value - 1], x, y, w, h);
}

// サイコロを振った時に発生するイベントの関数
function RollDice(){
	$rollDice.style.display = 'none';
	let value0 = GetValue();
	let value1 = GetValue();

	player0 += value0;
	if(player0 >= goal){
		value0 -= player0 - goal;
		player0 = goal;
	}

	player1 += value1;
	if(player1 >= goal){
		value1 -= player1 - goal;
		player1 = goal;
	}

	let values = [2, 6, 3, 1, 4, 5];

	let interval = 500;
	let interval2 = 80;
	setTimeout(()=>{
		// サイコロが転がっているような演出
		diceSound.currentTime = 0;
		diceSound.play();
		for(let i=0; i<6; i++){
			setTimeout(()=>{
				diceValue0 = values[i];
				DrawField();
			}, interval2 * i);
		}
		// そのあとサイコロの目を表示
		setTimeout(()=>{
			diceSound.pause();
			diceValue0 = value0;
			DrawField();
		}, interval2 * 6);
	}, interval);

	// キャラクターを移動させる
	for(let i=0; i<value0; i++){
		setTimeout(()=>{
			MovePlayer(0);
		}, interval * (i + 2));
	};

	// プレイヤー勝利の場合はその旨を表示
	setTimeout(()=>{
		if(player0 == goal){
			ctx.fillStyle = '#f0f';
			ctx.font = '24px ＭＳ ゴシック';
			ctx.fillText('あなたの勝ち',  50, 30);
			winSound.currentTime = 0;
			winSound.play();
			Finish();
		};
	}, interval * (value0 + 2));

	// もしプレイヤーが勝利ならここで終了
	if(player0 == goal)
		return;

	// コンピュータがサイコロを振る処理
	setTimeout(()=>{
		// サイコロが転がっているような演出
		diceSound.currentTime = 0;
		diceSound.play();
		for(let i=0; i<6; i++){
			setTimeout(()=>{
				diceValue1 = values[i];
				DrawField();
			}, interval2 * i);
		};
		// サイコロの目を表示
		setTimeout(()=>{
			diceSound.pause();
			diceValue1 = value1;
			DrawField();
		}, interval2 * 6);
	}, interval * (value0 + 2));

	// コンピュータの駒を移動させる
	for(let i=0; i<value1; i++){
		setTimeout(()=>{
			MovePlayer(1);
		}, interval * (value0 + 3 + i));
	};
	
	// コンピュータ側の処理終了
	setTimeout(()=>{
		if(player1 == goal){ // プレイヤー敗北の場合はその旨を表示
			ctx.fillStyle = '#f0f';
			ctx.font = '24px ＭＳ ゴシック';
			ctx.fillText('あなたの負け',  50, 30);
			loseSound.currentTime = 0;
			loseSound.play();
			Finish();
		}
		else // 決着がついていない場合は再びサイコロを振れるようにする
			$rollDice.style.display = 'block';

	}, interval * (value0 + value1 + 3));
};


// キャラクターを移動させる関数
function MovePlayer(player){
	walkSound.currentTime = 0;
	walkSound.play();

	for(let i = 0; i < 10; i++){
		setTimeout(()=>{
			if(player == 0){
				shift0 += 5;
			}
			else {
				shift1 += 5;
			}
			DrawField();
		}, 50 * i);
	};
};

function GetValue(){
	return Math.floor(Math.random() * 6) + 1;
};

