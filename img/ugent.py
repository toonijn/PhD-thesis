from matplotlib import cm
import matplotlib.colors as mc
import itertools
from math import pi
import matplotlib as mpl

mpl.rc('text', usetex=True)
mpl.rc('text.latex', preamble=r'\usepackage{amsmath}')
mpl.rc('font', family='serif', size=14, serif="Computer Modern Roman")

kleuren = {
    'wit': "#FFFFFF",
    'zwart': "#000000",
    "blauw": "#1E64C8",
    'geel': "#FFD200",
    "oranje": "#F1A42B",
    "rood": "#DC4E28",
    "aqua": "#2D8CA8",
    "roze": "#E85E71",
    "hemelsblauw": "#8BBEE8",
    "lichtgroen": "#AEB050",
    "paars": "#825491",
    "warmoranje": "#FB7E3A",
    "turquoise": "#27ABAD",
    "lichtpaars": "#BE5190",
    "groen": "#71A860",
}

for k in kleuren:
    kleuren[k] = mc.to_rgb(kleuren[k])

globals().update(kleuren)

rainbow_kleuren = [
    'blauw', 'rood', 'geel', 'paars', 'groen', 'warmoranje', 'aqua', 'lichtpaars', 'hemelsblauw'
]
rainbow_kleuren.append(rainbow_kleuren[0])

RdBu = mc.LinearSegmentedColormap.from_list("ugent_RdBu", list(map(kleuren.get, [
    'rood', 'wit', 'blauw'])))
Rainbow = mc.LinearSegmentedColormap.from_list(
    "ugent_Rainbow", list(map(kleuren.get, rainbow_kleuren)))


def mix(a, b, f):
    return tuple((1-f)*x + f*y for x, y in zip(a, b))


class LazyMap:
    def __init__(self, f):
        self.f = f

    def __getitem__(self, i):
        return self.f(i)

    def __iter__(self):
        return map(self.f, itertools.count())


palet_N = len(rainbow_kleuren)-1
palet = LazyMap(lambda x: Rainbow(((x / palet_N % 1) + pi**(x//palet_N)) % 1))

cm.register_cmap("ugent_RdBu", RdBu)


if __name__ == "__main__":
    import matplotlib.pyplot as plt
    import numpy as np

    ts = np.linspace(0, 10, 200)

    plt.figure()
    for kleur, i in zip(palet, range(20)):
        plt.plot(ts, np.sin(ts + 0.1*i)+i, color=kleur)
    plt.show()
