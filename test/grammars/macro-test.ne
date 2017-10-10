combine[X, Y] -> $X | $Y | $X "/" $Y | $Y "/" $X

main -> combine["a", "b"] {% function() {return 'a/b'} %}
