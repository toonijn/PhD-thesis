from setuptools import setup, find_packages

setup(
    name='pygmentsugent',
    version='0.0.1',
    license='MIT',
    description='Pygments style for UGent',
    author='Toon Baeyens',
    packages=find_packages(),
    install_requires=['pygments >= 1.5'],
    entry_points="""
[pygments.styles]
ugent = styles.ugent:UGentStyle
""",
)
