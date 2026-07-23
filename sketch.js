let currentQuestion = 0;
let transitionStart = null;
let transitionDone = false;
let introDone = false;
let startBtn;
let wrongAttempts = 0;

const transitionDuration = 1200;
const transitionHold = 1200;

const questions = [
  {
    number: "A",
    key: "unitAdjacent",
    prompt: "What is the length of the adjacent side of angle β (box 1)?",
    answer: "cos b",
    hint: "The adjacent side on the unit circle is the cosine of the angle."
  },
  {
    number: "B",
    key: "unitOpposite",
    prompt: "What is the length of the opposite side of angle β (box 2)?",
    answer: "sin b",
    hint: "The opposite side on the unit circle is the sine of the angle."
  },
  {
  number: 1,
  key: "bottom",
  prompt: "What is the length of the adjacent side of angle α (box 1)?",
  answer: "cos a cos b",
  answers: [
    "cos a cos b",
    "cos b cos a"
  ],
  hint: "We're looking for the adjacent side of α and we have the hypotenuse side."
  },
  {
    number: 2,
    key: "rightBottom",
    prompt: "What is the length of the opposite side of angle α (box 2)?",
    answer: "sin a cos b",
    answers: [
      "sin a cos b",
      "cos b sin a"
    ],
    hint: "We're looking for the opposite side of α and we have the hypotenuse side."
  },
  {
    number: 3,
    key: "topRight",
    prompt: "What is the length of the opposite side of angle α (box 3)?",
    answer: "sin a sin b",
    answers: [
      "sin a sin b",
      "sin b sin a"
    ],
    hint: "We're looking for the opposite side of α and we have the hypotenuse side."
  },
  {
    number: 4,
    key: "rightTop",
    prompt: "What is the length of the adjacent side of angle α (box 4)?",
    answer: "cos a sin b",
    answers: [
      "cos a sin b",
      "sin b cos a"
    ],
    hint: "We're looking for the adjacent side of α and we have the hypotenuse side."
  },
  {
    number: 5,
    key: "topLeft",
    prompt: "What is the length of the adjacent side of angle α + β (box 5)?",
    answer: "cos(a+b)",
        answers: [
      "cos(a+b)",
      "cos(b+a)"
    ],
    hint: "This side is adjacent to the angle α + β."
  },
  {
    number: 6,
    key: "left",
    prompt: "What is the length of the opposite side of angle α + β (box 6)?",
    answer: "sin(a+b)",
    answers: [
      "sin(a+b)",
      "sin(b+a)"
    ],
    hint: "This side is opposite the angle α + β."
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
let checkBtn;

function setup() {
  createCanvas(1050, 600);

  promptDiv = createDiv("");
  promptDiv.style("font-size", "20px");
  promptDiv.style("margin", "10px");

  answerBox = createInput("");
  answerBox.size(250);

  checkBtn = createButton("Check");
  checkBtn.mousePressed(checkAnswer);

  feedback = createDiv("");
  startBtn = createButton("Start");
  startBtn.mousePressed(startModule);
  startBtn.size(120, 40);
  startBtn.position(130, 460);

  answerBox.hide();
  checkBtn.hide();
  feedback.style("margin-top", "10px");

  updatePrompt();
}

function draw() {
  background(250);

  if (!introDone) {
    drawIntroScreen();
    return;
  }

  if (currentQuestion < 2) {
    drawUnitCircleIntro(0);
  } else if (!transitionDone) {
    drawProofBuildTransition();
  } else {
    drawProof();
  }

    if (introDone) {
      drawTrigReminder();
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

function drawIntroScreen() {
  fill(255);
  stroke(210);
  rect(90, 80, 620, 450, 8);

  noStroke();
  fill(0);
  textAlign(LEFT);
  textSize(26);
  text("Angle Sum Visual Module", 130, 130);

  textSize(18);
  text(
    "Let's learn how angles can be added using sines and cosines.",
    130,
    180
  );

  text(
    "We will start with a triangle that has angle (β) and hypotenuse 1.",
    130,
    220
  );

  text(
    "Because the hypotenuse is 1, the triangle sits on the unit circle.",
    130,
    260
  );

  text(
    "Your first goal is to identify the adjacent side and the opposite side.",
    130,
    300
  );

  text(
    "Then we will build a larger diagram that reveals the angle sum formulas.",
    130,
    340
  );

  textSize(20);
  fill(40, 90, 160);
  text("Start by finding the adjacent and opposite sides to the angle β.", 130, 400);

  textSize(16);
  fill(80);

  text(
    "Typing tip: you can use a for α and b for β.",
    130,
    430
  );
}

function updatePrompt() {
  if (!introDone) {
    promptDiv.html("");
    return;
  }

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

  const expectedAnswers =
    questions[currentQuestion].answers ||
    [questions[currentQuestion].answer];
  
  const isCorrect = expectedAnswers
    .map(normalize)
    .includes(user);
  
  if (isCorrect) {
    revealed[questions[currentQuestion].key] = true;

    feedback.html("Correct");
    feedback.style("color", "green");

    wrongAttempts = 0;

    currentQuestion++;

    if (currentQuestion === 2) {
    transitionStart = millis();
    promptDiv.html("Now let's build the full diagram.");
  } else {
    updatePrompt();
  }
    
    answerBox.value("");
  } else {
    wrongAttempts++;
    
    if (wrongAttempts === 1) {
      feedback.html("Try again.");
      feedback.style("color", "red");
    } else {
      feedback.html(
        "Hint: " + questions[currentQuestion].hint
      );
      feedback.style("color", "rgb(180, 90, 0)");
    }
  }
}

function drawProof() {
  const x = 160;
  const y = 70;

  const W = 320;
  const H = 420;

  const stage = getProofStage();

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

  // outer rectangle appears last
  if (stage >= 3) {
    stroke(100);
    fill(245);
    rect(x, y, W, H);
  }

  // bottom-right triangle appears first
  if (stage >= 1) {
    fill(140, 210, 235);
    stroke(100);

    triangle(
      BL.x,
      BL.y,
      RIGHT.x,
      RIGHT.y,
      x + W,
      y + H
    );
  }

  // top-right triangle appears second
  if (stage >= 2) {
    fill(140, 210, 235);
    stroke(100);

    triangle(
      TOP.x,
      TOP.y,
      x + W,
      y,
      RIGHT.x,
      RIGHT.y
    );
  }

  // pink center triangle is always visible
  fill(225, 190, 190);
  stroke(100);

  beginShape();
  vertex(BL.x, BL.y);
  vertex(TOP.x, TOP.y);
  vertex(RIGHT.x, RIGHT.y);
  endShape(CLOSE);

  drawQuestionHighlight(
    x,
    y,
    W,
    H,
    BL,
    TOP,
    RIGHT
  );

  // main triangle edges
  stroke(80);
  strokeWeight(1);

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

    // angle arcs

  noFill();
  stroke(0);
  strokeWeight(1);

  // beta in the main pink triangle
  arc(
    BL.x,
    BL.y+3,
    70,
    70,
    -1.35,
    -0.25
  );

  // alpha in the top-right triangle
  if (stage >= 2) {
    arc(
      RIGHT.x,
      RIGHT.y,
      70,
      70,
      -2.25,
      -1.55
    );
  }

  // alpha + beta in the top-left region
  if (stage >= 3) {
    arc(
      TOP.x,
      TOP.y,
      80,
      80,
      2.05,
      3.1
    );
  }

  // right angle mark inside the pink triangle
  drawRightAngleMark(
    RIGHT,
    TOP,
    BL,
    22
  );

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

  // pink triangle side labels
  push();
  translate(x + 230, y + 130);
  rotate(-0.6);
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
    "β",
    x + 35,
    y + H - 40
  );

  // alpha labels appear when bottom-right/top-right pieces exist
  if (stage >= 1) {
    text(
      "α",
      x + 50,
      y + 410
    );
  }

  if (stage >= 2) {
    text(
      "α",
      x + W - 15,
      y + 165
    );
  }

  // alpha + beta labels appear with the final top-left region
  if (stage >= 3) {
    textSize(18);

    text(
      "α + β",
      x + 112,
      y + 35
    );
  }

  // side labels revealed by stage
  if (stage >= 1) {
    drawProofLabel(
      "bottom",
      "cos α cos β",
      x + 160,
      y + H + 20
    );

    drawProofLabel(
      "rightBottom",
      "sin α cos β",
      x + W + 20,
      y + 300,
      true
    );
  }

  if (stage >= 2) {
    drawProofLabel(
      "topRight",
      "sin α sin β",
      x + 250,
      y - 20
    );

    drawProofLabel(
      "rightTop",
      "cos α sin β",
      x + W + 20,
      y + 100,
      true
    );
  }

  if (stage >= 3) {
    drawProofLabel(
      "topLeft",
      "cos(α + β)",
      x + 70,
      y - 20
    );

    drawProofLabel(
      "left",
      "sin(α + β)",
      x - 20,
      y + 210,
      true
    );
  }
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

    if (
    currentQuestion < questions.length &&
    questions[currentQuestion].key === key &&
    !revealed[key]
  ) {
    noFill();
    stroke(255, 160, 0);
    strokeWeight(3);
    rectMode(CENTER);
    rect(x, y, 98, 32);
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
    drawIntroBox("1", (cx + betaX) / 2, cy + 25);
  }

  if (revealed.unitOpposite) {
    push();
    translate(betaX + 25, (cy + betaY) / 2);
    rotate(HALF_PI);
    textSize(18);
    text("sin β", 0, 0);
    pop();
  } else {
    drawIntroBox("2", betaX + 25, (cy + betaY) / 2, true);
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
  text("Unit circle", cx, 60);
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

function startModule() {
  introDone = true;

  startBtn.hide();
  answerBox.show();
  checkBtn.show();

  updatePrompt();
}

function drawQuestionHighlight(x, y, W, H, BL, TOP, RIGHT) {
  if (currentQuestion >= questions.length) return;

  const key = questions[currentQuestion].key;

  push();

  stroke(255, 180, 0);
  strokeWeight(4);
  noFill();

  if (key === "left" || key === "topLeft") {
  // Highlight the top-left triangle
  triangle(
      x,
      y,
      x,
      y + H,
      TOP.x,
      TOP.y
    );
  }

  if (key === "bottom") {
    // Highlight bottom blue triangle
    triangle(
      BL.x,
      BL.y,
      RIGHT.x,
      RIGHT.y,
      x + W,
      y + H
    );
  }

  if (key === "topRight" || key === "rightTop") {
    // Highlight top blue triangle
    triangle(
      TOP.x,
      TOP.y,
      x + W,
      y,
      RIGHT.x,
      RIGHT.y
    );
  }

  if (key === "rightBottom") {
    // Highlight lower-right blue triangle
    triangle(
      BL.x,
      BL.y,
      RIGHT.x,
      RIGHT.y,
      x + W,
      y + H
    );
  }

  pop();
}

function getProofStage() {
  if (currentQuestion < 2) {
    return 0;
  }

  if (currentQuestion < 4) {
    return 1; // bottom-right triangle
  }

  if (currentQuestion < 6) {
    return 2; // top-right triangle
  }

  return 3; // top-left region
}

function drawTrigReminder() {
  const x = 810;
  const y = 110;

  push();

  fill(255);
  stroke(210);
  rect(x - 30, y - 45, 250, 400, 8);

  noStroke();
  fill(0);
  textAlign(CENTER);
  textSize(20);
  text("Right Triangle Reminder", x + 95, y - 15);

  // triangle
  const ax = x;
  const ay = y + 190;

  const bx = x + 150;
  const by = y + 190;

  const cx = x + 150;
  const cy = y + 80;

  stroke(0);
  strokeWeight(2);
  fill(245);

  triangle(ax, ay, bx, by, cx, cy);

  // right angle box
  noFill();
  rect(bx - 18, by - 18, 18, 18);

  // theta arc
  noFill();
  arc(ax, ay, 60, 60, -0.62, 0);

  noStroke();
  fill(0);
  textSize(20);
  text("θ", ax + 42, ay - 12);

  // side labels
  textSize(14);

  text("adjacent", (ax + bx) / 2, ay + 22);

  push();
  translate(cx + 23, (cy + by) / 2);
  rotate(HALF_PI);
  text("opposite", 0, 0);
  pop();

  push();
  translate(x + 65, y + 115);
  rotate(-0.63);
  text("hypotenuse", 0, 0);
  pop();

  // formulas
  textAlign(LEFT);
  textSize(18);

    noStroke();
    fill(0);
    text("sin θ =", x - 5, y + 255);
    text("opposite", x + 82, y + 243);
  
    stroke(0);
    strokeWeight(1);
    line(x + 78, y + 250, x + 170, y + 250);
  
    noStroke();
    text("hypotenuse", x + 78, y + 272);
  
    text("cos θ =", x - 5, y + 310);
    text("adjacent", x + 82, y + 298);
  
    stroke(0);
    strokeWeight(1);
    line(x + 78, y + 305, x + 170, y + 305);
  
    noStroke();
    text("hypotenuse", x + 78, y + 327);

  pop();
}

function drawRightAngleMark(corner, p1, p2, size) {
  let v1 = p5.Vector.sub(p1, corner).normalize();
  let v2 = p5.Vector.sub(p2, corner).normalize();

  let a = p5.Vector.add(
    corner,
    p5.Vector.mult(v1, size)
  );

  let b = p5.Vector.add(
    a,
    p5.Vector.mult(v2, size)
  );

  let c = p5.Vector.add(
    corner,
    p5.Vector.mult(v2, size)
  );

  noFill();
  stroke(0);
  strokeWeight(1);

  line(a.x, a.y, b.x, b.y);
  line(b.x, b.y, c.x, c.y);
}