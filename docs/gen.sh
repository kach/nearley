VERSION=$(cat ../package.json | grep version | cut -d '"' -f4)

page() {
    DEST=$(echo "$1" | sed s/.md/.html/)
    cat templates/header.html | sed "s/V.2/$VERSION/" > $DEST
    marked --gfm --smartypants "$1" >> $DEST
    cat templates/footer.html >> $DEST
}

rm *.html
for i in $(ls *.md); do
    page "$i"
done
