from strands import Schrodinger2D, Rectangle
from math import sqrt

schrodinger = Schrodinger2D(
    lambda x, y: x**2 + y**2 + sqrt(5)/30*(3 * x * y**2 - x**3),
    Rectangle(-10, 10, -10, 10),
    gridSize=(48, 48), maxBasisSize=32)
print(schrodinger.eigenvalues(10))
