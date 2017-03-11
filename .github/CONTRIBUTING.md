Hi! Thanks for your interest in contributing to nearley. nearley has always
been a community-driven project, and we have a history of almost always merging
good-quality PRs.

Unfortunately, we're a small team with limited time to work on nearley. If you
follow these guidelines, we'll be able to get to your issue much faster!

---

Before submitting any **issue**, have you done the following?
* Read [the
  README](https://github.com/Hardmath123/nearley/blob/master/README.md).
* Included the version of node (`node -v`), npm (`npm -v`), and nearley
  (`nearleyc -v`) that you are using. Ideally, these should all be up-to-date.

If you think you have found a **bug**, have you done the following?
* Included a _minimal_ example demonstrating that bug, along with expected and
  actual output.
* Extra credit: suggested a solution.

If you are asking for **help**, have you done the following?
* Looked through our [frequently asked
  questions](https://github.com/Hardmath123/nearley/issues?utf8=✓&q=label%3Aquestion),
  on the off chance that someone has already asked that question.
* Included the _full_ source to your grammar, including supporting files for
  postprocessors.

If you are suggesting a **feature**, have you done the following?
* Looked through past issues, open and closed, to see whether it has been
  suggested before.
* Offered a _compelling_ use-case that _cannot_ be accomplished with nearley as
  it stands.

---

Before submitting a **pull request**, have you done the following?
* Read [the
  README](https://github.com/Hardmath123/nearley/blob/master/README.md).
* Checked in with a maintainer before you start hacking, to make sure it is
  something we would merge (this is more important for bigger changes).
* Run the benchmark (`npm run benchmark`) and test suite (`npm test`) with and
  without your change to detect possible bugs, and included the output in your
  pull request as a separate comment. Parsing is tricky, and innocent changes
  can sometimes kill performance. :-(
* _Not_ introduced any new dependencies. Check in with a maintainer if you
  think you need a dependency.
* Documented your changes --- new features should be mentioned in the README.
