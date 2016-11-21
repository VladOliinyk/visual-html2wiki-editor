function getHtml() {

    var editor = CKEDITOR.instances.editor;

    var html = editor.getData()
    var textarea = $("#htmlcode");

    textarea.val(html);
    console.log("Here is your HTML: \n" + html);
}


function HTMLtoWIKI(html) {
    var str = html+"";

    // <p> <\p>
    str = str.replace(/<p>/g, "");
    str = str.replace(/<\/p>/g, "\n");

    // H1 - 1st lvl header
    str = str.replace(/<h1>/g, "= ");
    str = str.replace(/<\/h1>/g, " =");
    // H2 - 2nd lvl header
    str = str.replace(/<h2>/g, "== ");
    str = str.replace(/<\/h2>/g, " ==");
    // H3 - 3rd lvl header
    str = str.replace(/<h3>/g, "=== ");
    str = str.replace(/<\/h3>/g, " ===");
    // H4 - 4th lvl header
    str = str.replace(/<h4>/g, "==== ");
    str = str.replace(/<\/h4>/g, " ====");
    // H5 - 5th lvl header
    str = str.replace(/<h5>/g, "===== ");
    str = str.replace(/<\/h5>/g, " =====");
    // H6 - 6th lvl header
    str = str.replace(/<h6>/g, "====== ");
    str = str.replace(/<\/h6>/g, " ======");

    // <strong> </strong> - bold text
    str = str.replace(/<strong>/g, "'''");
    str = str.replace(/<\/strong>/g, "'''");

    // <em> </em> - italic text
    str = str.replace(/<em>/g, "''");
    str = str.replace(/<\/em>/g, "''");

    return str;
}

function getWiki() {

    getHtml();

    var editor = CKEDITOR.instances.editor;

    var html = editor.getData();
    var textarea = $("#wikicode");

    // converting html to wiki
    var wiki = HTMLtoWIKI(html);

    textarea.val(wiki);
    console.log("Here is your wiki: \n" + wiki);
}