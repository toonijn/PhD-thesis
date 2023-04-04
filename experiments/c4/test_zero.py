from strands import Schrodinger2D, Rectangle
from math import pi

schrodinger = Schrodinger2D(
    lambda x, y: 0, Rectangle(0, pi, 0, pi),
    gridSize=(32, 32), maxBasisSize=32)
print(schrodinger.eigenvalues(10))
