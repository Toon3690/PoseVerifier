let video;
let poseNet;
let pose;
let skeleton;

let nn;
let poseLabel = "1";
let correctLabel = 1;

let correctPosition;


function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.hide();

  const optionsForPoseNet = {
    //flipHorizontal: true,
    detectionType : 'single',
  };

  poseNet = ml5.poseNet(video, optionsForPoseNet, modelLoaded);
  poseNet.on('pose', gotPoses);

  //neural network opties
  let options = {
    inputs: 34,
    outputs: 4,
    task: 'classification',
    debug: true
  }

  //initialize neural network
  nn = ml5.neuralNetwork(options);

  //add data
  const modelInfo = {
    model: 'model/model.json',
    metadata: 'model/model_meta.json',
    weights: 'model/model.weights.bin',
  };


  /*setInterval(() => {
    changeLabel();
  }, 5000);*/


  //speel intro video af
  introVideo();


  correctPosition = true;
  setTimeout(function () {
    console.log("nu beginnen");
    setInterval(() => {
      if (correctPosition) {
        console.log("got this one");
        changeLabel();
      }
    }, 2000);
  }, 6500);

  //laad het model
  nn.load(modelInfo, brainLoaded);
}

//model is geladen
function modelLoaded() {
  console.log('poseNet ready');
}

//functie voor intro video
function introVideo() {
  document.getElementById("vid").src = `video/intro.mp4`;
  document.getElementById("vid").autoplay = true;
  console.log("intro");
}

//functie voor label te changen en de dingen daar rondom
function changeLabel() {
  correctLabel = int(random(1, 5));
  console.log('label changed to: ' + correctLabel);
  document.getElementById("vid").src = `video/${correctLabel}.mp4`;
  correctPosition = false;
}

//pose en skeleton zetten
function gotPoses(poses) {
  if (poses.length > 0) {
    pose = poses[0].pose;
    skeleton = poses[0].skeleton;
  }
}

//classificeer de pose
function brainLoaded() {
  console.log('pose classification ready!');
  classifyPose();
}


function classifyPose() {
  if (pose) {
    let inputs = [];
    for (let i = 0; i < pose.keypoints.length; i++) {
      let x = pose.keypoints[i].position.x;
      let y = pose.keypoints[i].position.y;
      inputs.push(x);
      inputs.push(y);
    }
    //console.log(inputs);

    //classificeer
    nn.classify(inputs, handleResults);

  } else {
    setTimeout(classifyPose, 50);
  }
}



//pak de results en check of de pose overeenkomt met het gevraagde
function handleResults(error, results) {
  //console.log(results);

  if (results[0].confidence > 0.95) {
    if (results[0].label == correctLabel) {
      //console.log('nice');
      //console.log(results[0].label);
      document.body.style.backgroundColor = "green";
      correctPosition = true;
    } else {
      document.body.style.backgroundColor = "red";
    }
  }
  //console.log(results[0].confidence);
  classifyPose();
}


function draw() {
  //console.log(correctPosition);
  translate(video.width, 0);
  scale(-1, 1);
  image(video, 0, 0, video.width, video.height);

  if (pose) {
    for (let i = 0; i < pose.keypoints.length; i++) {
      let x = pose.keypoints[i].position.x;
      let y = pose.keypoints[i].position.y;
      fill(0);
      ellipse(x, y, 10, 10);
    }
  }
}