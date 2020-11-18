let nn;

function setup() {
  createCanvas(640, 480);
  let options = {
    inputs: 34,
    outputs: 4,
    task: 'classification',
    debug: true
  }
  nn = ml5.neuralNetwork(options);
  nn.loadData('1234.json', dataReady);
}

function dataReady() {
    console.log('allee werk nu');

    console.log(nn);

    /*function reverseStringify( brain ) {
        return brain.slice( )
            .reverse( )
            .join( ' ' ); }*/

  nn.normalizeData();

  console.log(nn.normalizeData);

  //train neural network
  nn.train({epochs: 100}, doneTraining); 
}

function doneTraining() {
  console.log('done!');
  nn.save();
}