let currentQuestion = 0;
let transitionStart = null;
let transitionDone = false;

const transitionDuration = 1200;
const transitionHold = 1200;

const questions = [
  {
    number: "A",
    key: "unitAdjacent",
    prompt: "In the unit circle, what is the adjacent side to β?",
    answer: "cos b"
  },
  {
    number: "B",
    key: "unitOpposite",
    prompt: "In the unit circle, what is the opposite side to β?",
    answer: "sin b"
  },
  {
    number: 1,
    key: "left",
    prompt: "What expression goes in box 1?",
    answer: "sin(a+b)"
  },
  {
    number: 2,
    key: "bottom",
    prompt: "What expression goes in box 2?",
    answer: "cos a cos b"
  },
  {
    number: 3,
    key: "topLeft",
    prompt: "What expression goes in box 3?",
    answer: "cos(a+b)"
  },
  {
    number: 4,
    key: "topRight",
    prompt: "What expression goes in box 4?",
    answer: "sin a sin b"
  },
  {
    number: 5,
    key: "rightTop",
    prompt: "What expression goes in box 5?",
    answer: "cos a sin b"
  },
  {
    number: 6,
    key: "rightBottom",
    prompt: "What expression goes in box 6?",
    answer: "sin a cos b"
  }
];

let revealed = {
  unitAdjacent: false,
  unitOpposite: false,
  
  left: false,
  bottom: false,
  topLeft: false,
  topRight: false,
  rightTop: false,
  rightBottom: false
};

let answerBox;
let feedback;
let promptDiv;

function setup() {
  createCanvas(800, 600);

  promptDiv = createDiv("");
  promptDiv.style("font-size", "20px");
  promptDiv.style("margin", "10px");

  answerBox = createInput("");
  answerBox.size(250);

  let checkBtn = createButton("Check");
  checkBtn.mousePressed(checkAnswer);

  feedback = createDiv("");
  feedback.style("margin-top", "10px");

  updatePrompt();
}

function draw() {
  background(250);

  if (currentQuestion < 2) {
    drawUnitCircleIntro(0);
  } else if (!transitionDone) {
  drawProofBuildTransition();
  } else {
    drawProof();
  }

  fill(0);
  textAlign(CENTER);
  textSize(26);

  if (currentQuestion >= questions.length) {
    text("Good job!", width / 2, height - 50);

    textSize(18);

    text(
      "sin(a+b) = sin(a)cos(b) + cos(a)sin(b)",
      width / 2,
      height - 30
    );

    text(
      "cos(a+b) = cos(a)cos(b) - sin(a)sin(b)",
      width / 2,
      height - 10
    );
  }
}

function updatePrompt() {
  if (currentQuestion >= questions.length) {
    return;
  }

  promptDiv.html(
    questions[currentQuestion].prompt
  );
}

function normalize(s) {
  return s
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[()]/g, "")
    .replace(/\*/g, "")
    .replace(/beta/g, "b")
    .replace(/alpha/g, "a")
    .replace(/Î±/g, "a")
    .replace(/Î²/g, "b")
    .replace(/α/g, "a")
    .replace(/β/g, "b");
}

function checkAnswer() {
  if (currentQuestion >= questions.length) return;

  const user = normalize(answerBox.value());

  const expected = normalize(
    questions[currentQuestion].answer
  );

  if (user === expected) {
    revealed[
      questions[currentQuestion].key
    ] = true;

    feedback.html("Correct");
    feedback.style("color", "green");

    currentQuestion++;

    if (currentQuestion === 2) {
    transitionStart = millis();
    promptDiv.html("Now let's build the full diagram.");
  } else {
    updatePrompt();
  }
    
    answerBox.value("");
  } else {
    feedback.html("Try again");
    feedback.style("color", "red");
  }
}

function drawProof() {

  const x = 160;
  const y = 70;

  const W = 320;
  const H = 420;

  // outer rectangle

  stroke(100);
  fill(245);

  rect(x, y, W, H);

  // important points

  const BL = createVector(x, y + H);

  const TOP = createVector(
    x + 170,
    y
  );

  const RIGHT = createVector(
    x + W,
    y + 210
  );

  // blue regions

  fill(140, 210, 235);

  triangle(
    TOP.x,
    TOP.y,
    x + W,
    y,
    RIGHT.x,
    RIGHT.y
  );

  triangle(
    BL.x,
    BL.y,
    RIGHT.x,
    RIGHT.y,
    x + W,
    y + H
  );

  // pink center

  fill(225, 190, 190);

  beginShape();
  vertex(BL.x, BL.y);
  vertex(TOP.x, TOP.y);
  vertex(RIGHT.x, RIGHT.y);
  endShape(CLOSE);

  // thick edges

  stroke(0);
  strokeWeight(4);

  line(
    BL.x,
    BL.y,
    TOP.x,
    TOP.y
  );

  line(
    TOP.x,
    TOP.y,
    RIGHT.x,
    RIGHT.y
  );

  line(
    RIGHT.x,
    RIGHT.y,
    BL.x,
    BL.y
  );

  strokeWeight(1);

  // central labels

  fill(0);
  noStroke();

  textAlign(CENTER);

  textSize(55);

  text(
    "1",
    x + 95,
    y + 200
  );

  textSize(22);

  // pink triangle side labels

  push();
  translate(x + 230, y + 130);
  rotate(-0.95);
  textSize(20);
  fill(0);
  text("sin β", 0, 0);
  pop();

  push();
  translate(x + 185, y + 290);
  rotate(-0.55);
  textSize(20);
  fill(0);
  text("cos β", 0, 0);
  pop();

  textSize(18);

  text(
    "α + β",
    x + 120,
    y + 30
  );

  textSize(18);

  text(
    "β",
    x + 35,
    y + H - 40
  );

  text(
    "α",
    x + W - 15,
    y + 165
  );

  text(
    "α",
    x + 50,
    y + 410
  );

  // side labels

  drawProofLabel(
  "left",
  "sin(α+β)",
  x - 20,
  y + 210,
  true
  );

  drawProofLabel(
    "topLeft",
    "cos(α+β)",
    x + 70,
    y - 20
  );

  drawProofLabel(
    "topRight",
    "sin α sin β",
    x + 250,
    y - 20
  );

  drawProofLabel(
    "bottom",
    "cos α cos β",
    x + 160,
    y + H + 20
  );

  drawProofLabel(
    "rightTop",
    "cos α sin β",
    x + W + 20,
    y + 100,
    true
  );

  drawProofLabel(
    "rightBottom",
    "sin α cos β",
    x + W + 20,
    y + 300,
    true
  );

  // formula reveal

  let fy = 540;

  textSize(22);

}

function drawProofLabel(
  key,
  label,
  x,
  y,
  vertical = false
) {

  push();

  if (vertical) {
    translate(x, y);
    rotate(HALF_PI);

    x = 0;
    y = 0;
  }

  textAlign(CENTER);

  if (revealed[key]) {

    noStroke();
    fill(0);

    textSize(16);

    text(label, x, y);

  } else {

    rectMode(CENTER);

    fill(255);
    stroke(0);

    rect(x, y, 90, 24);

    fill(120);
    noStroke();

    textSize(16);

    let q = questions.find(
    question => question.key === key
    );

    text(q.number, x, y + 1);
  }

  pop();
}

function drawUnitCircleIntro(t = 0) {
  const cx = width / 2;
  const cy = 320;
  const r = 180;

  const betaStart = -0.75;
  const betaEnd = -1.05;

  const alphaAngle = -0.45;

  const beta = lerp(betaStart, betaEnd, t);

  const betaX = cx + r * cos(beta);
  const betaY = cy + r * sin(beta);

  const alphaX = cx + r * cos(alphaAngle);
  const alphaY = cy + r * sin(alphaAngle);

  stroke(180);
  strokeWeight(1);
  noFill();

  circle(cx, cy, r * 2);

  stroke(0);

  line(cx - r - 30, cy, cx + r + 30, cy);
  line(cx, cy + r + 30, cx, cy - r - 30);

  fill(0);
  noStroke();
  textSize(18);
  text("x", cx + r + 45, cy + 5);
  text("y", cx - 10, cy - r - 40);

  // beta radius
  stroke(0);
  strokeWeight(3);
  line(cx, cy, betaX, betaY);

  // beta side lengths
  strokeWeight(1);
  stroke(80);
  line(betaX, betaY, betaX, cy);
  line(cx, cy, betaX, cy);

  // beta arc
  noFill();
  stroke(0);
  arc(cx, cy, 80, 80, beta, 0);

  noStroke();
  fill(0);
  textSize(22);
  text("β", cx + 55 * cos(beta / 2), cy + 55 * sin(beta / 2));

  // keep cos beta and sin beta visible after answered
  if (revealed.unitAdjacent) {
    textSize(18);
    text("cos β", (cx + betaX) / 2, cy + 25);
  } else {
    drawIntroBox("A", (cx + betaX) / 2, cy + 25);
  }

  if (revealed.unitOpposite) {
    push();
    translate(betaX + 25, (cy + betaY) / 2);
    rotate(HALF_PI);
    textSize(18);
    text("sin β", 0, 0);
    pop();
  } else {
    drawIntroBox("B", betaX + 25, (cy + betaY) / 2, true);
  }

  // alpha appears during the transition
  if (t > 0.15) {
    let alphaFade = map(t, 0.15, 1, 0, 255);
    alphaFade = constrain(alphaFade, 0, 255);

    stroke(0, alphaFade);
    strokeWeight(3);
    line(cx, cy, alphaX, alphaY);

    noFill();
    stroke(0, alphaFade);
    strokeWeight(1);
    arc(cx, cy, 120, 120, alphaAngle, 0);

    noStroke();
    fill(0, alphaFade);
    textSize(22);
    text(
      "α",
      cx + 78 * cos(alphaAngle / 2),
      cy + 78 * sin(alphaAngle / 2)
    );
  }

  fill(0);
  noStroke();
  textSize(20);
  text("Unit circle", cx, 90);
}

function drawIntroBox(number, x, y, vertical = false) {
  push();

  if (vertical) {
    translate(x, y);
    rotate(HALF_PI);
    x = 0;
    y = 0;
  }

  rectMode(CENTER);
  fill(255);
  stroke(0);
  rect(x, y, 80, 24);

  fill(120);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(16);
  text(number, x, y);

  pop();
}

function drawProofBuildTransition() {
  if (transitionStart === null) {
    transitionStart = millis();
  }

  let elapsed = millis() - transitionStart;
  let t = constrain(elapsed / transitionDuration, 0, 1);

  // smooth motion
  t = t * t * (3 - 2 * t);

  drawBuildingProof(t);

  if (elapsed > transitionDuration + transitionHold) {
    transitionDone = true;
    updatePrompt();
  }
}

function drawBuildingProof(t) {
  const startCx = width / 2;
  const startCy = 320;
  const startR = 180;
  const betaAngle = -0.75;

  const unitEndX = startCx + startR * cos(betaAngle);
  const unitEndY = startCy + startR * sin(betaAngle);

  const proofX = 160;
  const proofY = 70;
  const W = 320;
  const H = 420;

  const BL = createVector(proofX, proofY + H);
  const TOP = createVector(proofX + 170, proofY);
  const RIGHT = createVector(proofX + W, proofY + 210);

  const endCx = BL.x;
  const endCy = BL.y;

  const endBetaX = TOP.x;
  const endBetaY = TOP.y;

  const movingCx = lerp(startCx, endCx, t);
  const movingCy = lerp(startCy, endCy, t);

  const movingEndX = lerp(unitEndX, endBetaX, t);
  const movingEndY = lerp(unitEndY, endBetaY, t);

  // final diagram fades in while beta piece moves into it
  push();
  drawingContext.globalAlpha = t;
  drawProof();
  pop();

  // unit circle fades out
  push();
  drawingContext.globalAlpha = 1 - t;

  stroke(180);
  strokeWeight(1);
  noFill();
  circle(startCx, startCy, startR * 2);

  stroke(0);
  line(startCx - startR - 30, startCy, startCx + startR + 30, startCy);
  line(startCx, startCy + startR + 30, startCx, startCy - startR - 30);

  noStroke();
  fill(0);
  textSize(18);
  text("x", startCx + startR + 45, startCy + 5);
  text("y", startCx - 10, startCy - startR - 40);

  pop();

  // moving beta triangle piece
  stroke(0);
  strokeWeight(3);
  line(movingCx, movingCy, movingEndX, movingEndY);

  strokeWeight(1);
  stroke(80);

  const finalAdjX = RIGHT.x - 2;
  const finalAdjY = RIGHT.y + 2;
  
  const movingAdjX = lerp(unitEndX, finalAdjX, t);
  const movingAdjY = lerp(startCy, finalAdjY, t);

  line(movingCx, movingCy, movingAdjX, movingAdjY);
  line(movingEndX, movingEndY, movingAdjX, movingAdjY);

  noFill();
  stroke(0);
  arc(
    movingCx,
    movingCy,
    lerp(70, 60, t),
    lerp(70, 60, t),
    atan2(movingEndY - movingCy, movingEndX - movingCx),
    0
  );

  noStroke();
  fill(0);
  textSize(20);

  const betaLabelX = lerp(startCx + 45, proofX + 35, t);
  const betaLabelY = lerp(startCy - 18, proofY + H - 40, t);

  text("β", betaLabelX, betaLabelY);

  // moving cos beta label
  push();
  const cosX = lerp((startCx + unitEndX) / 2, proofX + 185, t);
  const cosY = lerp(startCy + 25, proofY + 290, t);
  translate(cosX, cosY);
  rotate(lerp(0, -0.55, t));
  textSize(20);
  text("cos β", 0, 0);
  pop();

  // moving sin beta label
  push();
  const sinX = lerp(unitEndX + 25, proofX + 230, t);
  const sinY = lerp((startCy + unitEndY) / 2, proofY + 130, t);
  translate(sinX, sinY);
  rotate(lerp(HALF_PI, -0.95, t));
  textSize(20);
  text("sin β", 0, 0);
  pop();
}