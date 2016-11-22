function getHtml() {

    var editor = CKEDITOR.instances.editor;

    var html = editor.getData()
    var textarea = $("#htmlcode");

    textarea.val(html);
    console.log("Here is your HTML: \n" + html);
}

function HTMLtoWIKI(html) {
    var str = html+"";

    str = str.replace(/\s\s /g, "");

    // <br />
    str = str.replace(/<br \/>/g, "");

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


    // HTML Codes
    str = str.replace(/(&nbsp;)*/g, ""); str = str.replace(/(&#32;)*/g, "");
    str = str.replace(/&#33;/g, "!");
    str = str.replace(/&#34;/g, "\""); str = str.replace(/&quot;/g, "\"");
    str = str.replace(/&#35;/g, "#");
    str = str.replace(/&#36;/g, "$");
    str = str.replace(/&#37;/g, "%");
    str = str.replace(/&#38;/g, "&"); str = str.replace(/&amp;/g, "&");
    str = str.replace(/&#39;/g, "'");
    str = str.replace(/&#40;/g, "(");
    str = str.replace(/&#41;/g, ")");
    str = str.replace(/&#42;/g, "*");
    str = str.replace(/&#43;/g, "+");
    str = str.replace(/&#44;/g, ",");
    str = str.replace(/&#45;/g, "-");
    str = str.replace(/&#46;/g, ".");
    str = str.replace(/&#47;/g, "/");
    str = str.replace(/&lt;/g, "<");
    str = str.replace(/&gt;/g, ">");

    // holy games with space characters
    str = str.replace(/&nbsp;/g, " ");
    str = str.replace(/( )+/g, " ");
    str = str.replace(/(&nbsp;)+/g, " ");
    str = str.replace(/(&nbsp;)+( )/g, " ");
    str = str.replace(/( )+(&nbsp;)/g, " ");

    // tables
    // '<table ATTRIBUTES >' -> '{| ATTRIBUTES'
    var tableOpenTag = str.match(/<table(.*?)>/);
    while (tableOpenTag) {
        str = str.replace(tableOpenTag[0], "{|" + tableOpenTag[1]);

        //find next match
        tableOpenTag = str.match(/<table(.*?)>/);
    };

    str = str.replace(/<\/table>/g, "|}");

    str = str.replace(/<tbody>/g, "");
    str = str.replace(/<\/tbody>/g, "");


    str = str.replace(/<tr>/g, "|-");
    str = str.replace(/<\/tr>/g, "|-");
    str = str.replace(/ \|-/g, "|-");

    str = str.replace(/<th>/g, "!");
    str = str.replace(/<\/th>/g, "");
    str = str.replace(/ !/g, "!");

    str = str.replace(/<td>/g, "|");
    str = str.replace(/<\/td>/g, "");
    str = str.replace(/ \|/g, "|");

    // double '|-' fix
    str = str.replace(/(\|-)+(.*)+(\n *)+(\|-)+/g, "|-");

    // first '|-' in table fix
    str = str.replace(/\n \n\|-/g, "\n|-");
    // last '|-' before '|}' fix
    str = str.replace(/(\|-)+(.*)+(\n *)+(\|})/g, "|}");

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