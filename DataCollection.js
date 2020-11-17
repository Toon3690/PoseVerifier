let video;
let poseNet;
let pose;
let skeleton;

let brain;

let state = 'waiting';
let targetLabel;

function keyPressed() {
    if (key == 's') {
        brain.saveData();
    } else {
        targetLabel = key;
        console.log(targetLabel);

        setTimeout(function () {
            console.log('collecting');
            state = 'collecting';

            setTimeout(function () {
                console.log('not collecting');
                state = 'waiting';
            }, 10000);

        }, 5000);
    }
}

function setup() {
    createCanvas(640, 480);
    video = createCapture(VIDEO);
    video.hide();
    poseNet = ml5.poseNet(video, modelLoaded);
    poseNet.on('pose', gotPoses);


    let options = {
        inputs: 34,
        outputs: 4,
        task: 'classification',
        debug: true
    }
    brain = ml5.neuralNetwork(options);
    //console.log(brain);
}

function gotPoses(poses) {
    //console.log(poses);
    if (poses.length > 0) {
        pose = poses[0].pose;
        skeleton = poses[0].skeleton;
        if (state == 'collecting') {
            let inputs = [];;
            for (let i = 0; i < skeleton.length; i++) {
                let x = pose.keypoints[i].position.x;
                let y = pose.keypoints[i].position.y;
                inputs.push(x);
                inputs.push(y);
            }
            let target = [targetLabel];

            brain.addData(inputs, target);
        }
    }
}

function modelLoaded() {
    console.log('poseNet is ready');
}

function draw() {
    translate(video.width, 0);
    scale(-1, 1);
    //fill(255,255);
   // rect(0,0,640,540);
    image(video, 0, 0, video.width, video.height);

    /*if (pose) {
        fill(255, 0, 0);
        ellipse(pose.nose.x, pose.nose.y, 64);

        for (let i = 0; i < pose.keypoints.length; i++) {
            let x = pose.keypoints[i].position.x;
            let y = pose.keypoints[i].position.y;
            fill(0, 255, 0);
            ellipse(x, y, 20, 20);
        }

        for (let i = 0; i < skeleton.length; i++) {
            let a = skeleton[i][0];
            let b = skeleton[i][1];
            strokeWeight(2);
            stroke(255);
            line(a.position.x, a.position.y, b.position.x, b.position.y);
        }

    }*/
    if (pose) {
        for (let i = 0; i < skeleton.length; i++) {
          let a = skeleton[i][0];
          let b = skeleton[i][1];
          strokeWeight(2);
          stroke(0);
    
          line(a.position.x, a.position.y, b.position.x, b.position.y);
        }
        for (let i = 0; i < pose.keypoints.length; i++) {
          let x = pose.keypoints[i].position.x;
          let y = pose.keypoints[i].position.y;
          fill(0);
          stroke(255);
          ellipse(x, y, 16, 16);
        }
      }

}