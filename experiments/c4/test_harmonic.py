from strands import Schrodinger2D, Rectangle

schrodinger = Schrodinger2D(
    lambda x, y: x * x + y * y, Rectangle(-9.5, 9.5, -9.5, 9.5),
    gridSize=(40, 40), maxBasisSize=30)
print(schrodinger.eigenvalues(10))
