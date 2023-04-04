from strands import Schrodinger2D, Rectangle
import numpy as np
import matplotlib.pyplot as plt

xs = np.linspace(-9.5, 9.5, 1000)
ys = np.linspace(-9.5, 9.5, 1000)
X, Y = np.meshgrid(xs, ys)

schrodinger = Schrodinger2D(
    lambda x, y: x * x + y * y, Rectangle(-9.5, 9.5, -9.5, 9.5),
    gridSize=(40, 40), maxBasisSize=30)

for E, f in schrodinger.eigenfunctions(10):
    plt.pcolormesh(X, Y, f(X, Y))
    plt.show()
