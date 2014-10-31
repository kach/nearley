# right.ne
# notice the analogy to tail recursive calls
# as it only COMPLETEs a single state for the current CHART
# eg. 500 "." takes < 1 millisecond

c -> null | c "."
