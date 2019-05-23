# Perceptron learns OR Logical Operations
import numpy as np
import math

LEARNINGRATE = 0.1
no_of_input = 2
no_of_iterations = 150
# weight[2] work as bias
weight = np.matrix([0,0,0], dtype=float)

# Logical OR Table
DATA_OR = [ {"inp": [1, 1], "out":1}, 
            {"inp": [1, 0], "out":1}, 
            {"inp": [0, 1],"out":1},
            {"inp": [0, 0],"out":0}]

# Activation Function
def heaviside(x):
    return 0 if x < 0 else 1

# Predict the Output
def predict(_input):
    global weight
    # Append 1 for Bias
    if len(_input) == no_of_input:
        _input.append(1)
    # Change input List to Numpy Matrix of FLoat    
    x = np.matrix([_input],dtype=float)
    ret = ( weight * np.transpose(x) ).A1[0]

    return heaviside(ret)


def train(inputs, target, outputs):
    global weight
    # Append 1 for Bias
    if len(inputs) == no_of_input:
        inputs.append(1)
    # Update all the Weights
    for i in range(no_of_input+1):
        weight.A1[i] = weight.A1[i] + LEARNINGRATE*(target-outputs)*inputs[i]


for i in range(no_of_iterations):
    t = predict(DATA_OR[i % 4]["inp"])
    print("Predicted {} = {}".format(DATA_OR[i % 4]["inp"][:no_of_input],t))
    train(DATA_OR[i % 4]["inp"],DATA_OR[i % 4]["out"],t)
    # Calculate Squared Error
    err = 0
    for i in range(len(DATA_OR)):
        z = (DATA_OR[i % 4]["out"] - t)
        err = err + z*z
    print("Error : ",math.sqrt(err))