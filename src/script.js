function getHtml() {

    var editor = CKEDITOR.instances.editor;

    var html = editor.getData()
    var textarea = $("#htmlcode");

    textarea.val(html);
    console.log("Here is your HTML: \n" + html);
}

function HTMLtoWIKI(html) {
    var str = html + "";

    // Removing '<br />' tag.
    str = str.replace(/<br \/>/g, "");

    // Removing '<p>' and '<\p>' tags to wiki-markup view.
    str = str.replace(/<p>/g, "");
    str = str.replace(/<\/p>/g, "");

    // Translating headers.
    str = str.replace(/<h1>/g, "= ");
    str = str.replace(/<\/h1>/g, " =");
    str = str.replace(/<h2>/g, "== ");
    str = str.replace(/<\/h2>/g, " ==");
    str = str.replace(/<h3>/g, "=== ");
    str = str.replace(/<\/h3>/g, " ===");
    str = str.replace(/<h4>/g, "==== ");
    str = str.replace(/<\/h4>/g, " ====");
    str = str.replace(/<h5>/g, "===== ");
    str = str.replace(/<\/h5>/g, " =====");
    str = str.replace(/<h6>/g, "====== ");
    str = str.replace(/<\/h6>/g, " ======");

    // Translating '<strong>' and '</strong>' tags (bold text).
    str = str.replace(/<strong>/g, "'''");
    str = str.replace(/<\/strong>/g, "'''");

    // Translating '<em>' and '</em>' tags (italic text).
    str = str.replace(/<em>/g, "''");
    str = str.replace(/<\/em>/g, "''");


    // Translating some HTML codes.
    str = str.replace(/(&nbsp;)*/g, "");
    str = str.replace(/(&#32;)*/g, "");
    str = str.replace(/&#33;/g, "!");
    str = str.replace(/&#34;/g, "\"");
    str = str.replace(/&quot;/g, "\"");
    str = str.replace(/&#35;/g, "#");
    str = str.replace(/&#36;/g, "$");
    str = str.replace(/&#37;/g, "%");
    str = str.replace(/&#38;/g, "&");
    str = str.replace(/&amp;/g, "&");
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
    /* Removing duplication of spaces or non-breaking space, combinations of space and non-breaking space.  */
    str = str.replace(/&nbsp;/g, " ");
    str = str.replace(/( )+/g, " ");
    str = str.replace(/(&nbsp;)+/g, " ");
    str = str.replace(/(&nbsp;)+( )/g, " ");
    str = str.replace(/( )+(&nbsp;)/g, " ");

    ///// TABLES /////
    // Translating '<table ATTRIBUTES >' to '{| ATTRIBUTES'.
    var tableOpenTag = str.match(/<table(.*?)>/);
    while (tableOpenTag) {
        str = str.replace(tableOpenTag[0], "{|" + tableOpenTag[1]);

        //find next match
        tableOpenTag = str.match(/<table(.*?)>/);
    }

    // Removing '<table>' and '</table>' tags.
    str = str.replace(/<\/table>/g, "|}");

    // Removing '<tbody>' and '</tbody>' tags.
    str = str.replace(/<tbody>/g, "");
    str = str.replace(/<\/tbody>/g, "");

    // Translating '<tr>' to '|-' and '</tr>' to '|-' and trash removing.
    str = str.replace(/<tr>/g, "|-");
    str = str.replace(/<\/tr>/g, "|-");
    str = str.replace(/ \|-/g, "|-");

    // Translating '<th> ... </th>' to '! ...' and trash removing.
    str = str.replace(/<th>/g, "!");
    str = str.replace(/<\/th>/g, "");
    str = str.replace(/ !/g, "!");

    // Translating '<td> ... </td>' to '| ...' and trash removing.
    str = str.replace(/<td>/g, "|");
    str = str.replace(/<\/td>/g, "");
    str = str.replace(/ \|/g, "|");

    // Double '|-' fix.
    /* In html we have '<tr> ... </tr>' tags.
     Both this tags translated to '|-' to wiki-markup.
     And when we have two or more rows with '<tr> ... </tr>' after translate we get duplication of '|-' in two rows.
     First '|-' from closing tag and second - from opening new row tag.
     Fix consist of removing that duplication.*/
    str = str.replace(/(\|-)+(.*)+(\n *)+(\|-)+/g, "|-");

    // First '|-' in table fix.
    /* Fix consist of removing all trash (unnecessary spaces and '\n') between end of attributes and first '|-' tag. */
    str = str.replace(/\n \n\|-/g, "\n|-");

    // Last '|-' before '|}' fix.
    /* Fix consist of removing all trash between last '|-' tag and the closing table tag. */
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