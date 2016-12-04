
function getHtml() {

    var editor = CKEDITOR.instances.editor;

    var html = editor.getData();
    var textarea = $("#htmlcode");

    textarea.val(html);
    copyToClipboard(html);
}

function HTMLtoWIKI(html) {
    var str = html + "";

    ///////////////////////////////////////////// <BR> TAGS ///////////////////////////////////////////////

    // Removing '<br />' tag.
    str = str.replace(/<br \/>/g, "");

    ////////////////////////////////////////// END OF <BR> TAGS ///////////////////////////////////////////

    /////////////////////////////////////// TEXT FORMATING TAGS ///////////////////////////////////////////
    // Translating '<strong>' and '</strong>' tags (bold text).
    str = str.replace(/<strong>/g, "'''");
    str = str.replace(/<\/strong>/g, "'''");

    str = str.replace(/<em>/g, "''");
    str = str.replace(/<\/em>/g, "''");

    str = str.replace(/<pre>/g, "<nowiki>");
    str = str.replace(/<\/pre>/g, "</nowiki>");

    str = str.replace(/<address>/g, "");
    str = str.replace(/<div>/g, "");

    str = str.replace(/<\/address>/g, "");
    str = str.replace(/<\/div>/g, "");

    /////////////////////////////////// END OF TEXT FORMATING TAGS ///////////////////////////////////////

    ////////////////////////////////////////////// <P> TAGS ///////////////////////////////////////////////

    // Removing '<p>' and '<\p>' tags to wiki-markup view.
    // Translating '<p ATTRIBUTES >' to '<p ATTRIBUTES >'.
    var preOpenTag = str.match(/<p(.*?)>/);
    while (preOpenTag) {
        var preAttributes = preOpenTag[1];
        if (preAttributes.length > 0) {
            preAttributes = "<p " + preAttributes + " >";
            str = str.replace(preOpenTag[0], preAttributes);

        } else {
            str = str.replace(preOpenTag[0], "");
            str = str.replace(/<\/p>/g, "");
        }
        //find next match
        preOpenTag = str.match(/<pre(.*?)>/);
    }

    // Remove last '<p>' tags.
    str = str.replace(/<p>/g, "");

    /////////////////////////////////////////// END OF <P> TAGS ////////////////////////////////////////////


    // Translating '<a LINK_URL > LINK_TEXT </a>' to '[LINK_URL LINK TEXT]' //and trash removing.
    var linkTag = str.match(/<a(.*href="(.*)")>(.*)<\/a>/);
    while (linkTag) {
        var linkUrl = linkTag[2];
        var linkText = linkTag[3];
        var linkStr = "";
        if (linkUrl.length > 0) {
            linkStr = "[" + linkUrl + " " + linkText + "]";
        }
        str = str.replace(linkTag[0], linkStr);

        //find next match
        linkTag = str.match(/<a(.*href="(.*)")>(.*)<\/a>/);
    }


    //////////////////////////////////////////////// LISTS ////////////////////////////////////////////////

    // Function that repeat the @userStr @count times.
    function repeatStr(count, userStr) {
        var resultStr = userStr;
        for (var i = count; i > 0; i--) {
            resultStr += userStr;
        }
        return resultStr;
    }

    /////////////////////////// NUMBERED LISTS ///////////////////////////

    // Match '<ol> ... </ol>' scope.
    var tmpOlStr = str.match(/<ol>((.*\n*)*?)<\/ol>/g);
    if (tmpOlStr != null) {
        if (tmpOlStr.length > 0) {
            str = str.replace(tmpOlStr[0], numberedList(tmpOlStr));
        }
    }

    // Function that replace numbered list html-tags to correct analogue tags in wiki-text.
    function numberedList(numberedListStr) {
        if (numberedListStr != null) {
            // Get actual '<ol> ... </ol>' scope part.
            numberedListStr = numberedListStr[0];

            // Replace all inner unnumbered list tags to numbered.
            numberedListStr = numberedListStr.replace(/ul>/g, "ol>")

            // Replace each list-level '<li>' tags to the the correct amount of '*'
            // 1st-level -> '*', 2nd-level -> '**', etc.
            var liOpenTag = numberedListStr.match(/(.*)<li>/);
            while (liOpenTag) {
                var countOfTabs = liOpenTag[0].length - 5;

                var tmpStr = '*';
                tmpStr = repeatStr(countOfTabs, tmpStr);

                numberedListStr = numberedListStr.replace(liOpenTag[0], tmpStr);

                //find next match
                liOpenTag = numberedListStr.match(/(.*)<li>/);
            }

            // Remove '<ol>' + '</li>' tags.
            numberedListStr = numberedListStr.replace(/<\/ol>\n.*<\/li>\n/g, "");

            // Remove '<ol>' tags.
            numberedListStr = numberedListStr.replace(/<ol(.*)>\n/g, "");

            // Remove single '</ol>' tags.
            numberedListStr = numberedListStr.replace(/<\/ol>\n?/g, "");

            // Remove last '</li>' tags.
            numberedListStr = numberedListStr.replace(/<\/li>/g, "");

            //str = str.replace(numberedListStr2, numberedListStr);
        }

        return numberedListStr;
    }

    //////////////////////////// END OF NUMBERED LISTS ///////////////////////////

    ////////////////////////////// UNNUMBERED LISTS /////////////////////////////
    // Match '<ul> ... </ul>' scope.
    var tmpUlStr = str.match(/<ul>((.*\n*)*?)<\/ul>/g);
    if (tmpUlStr != null) {
        if (tmpUlStr.length > 0) {
            str = str.replace(tmpUlStr[0], unnumberedList(tmpUlStr));
        }
    }

    // Function that replace unnumbered list html-tags to correct analogue tags in wiki-text.
    function unnumberedList(unnumberedListStr) {
        if (unnumberedListStr != null) {
            // Get actual '<ul> ... </ul>' scope part.
            unnumberedListStr = unnumberedListStr[0];

            // Replace all inner numbered list tags to unnumbered.
            unnumberedListStr = unnumberedListStr.replace(/ol>/g, "ul>"); // work

            // Replace each list-level '<li>' tags to the the correct amount of '*'
            // 1st-level -> '#', 2nd-level -> '##', etc.
            var unliOpenTag = unnumberedListStr.match(/(.*)<li>/);
            while (unliOpenTag) {
                var uncountOfTabs = unliOpenTag[0].length - 5;

                var untmpStr = '#';
                untmpStr = repeatStr(uncountOfTabs, untmpStr);

                unnumberedListStr = unnumberedListStr.replace(unliOpenTag[0], untmpStr);

                //find next match
                unliOpenTag = unnumberedListStr.match(/(.*)<li>/);
            }

            // Remove '<ul>' + '</li>' tags.
            unnumberedListStr = unnumberedListStr.replace(/<\/ul>\n.*<\/li>\n/g, "");

            // Remove '<ul>' tags.
            unnumberedListStr = unnumberedListStr.replace(/<ul(.*)>\n/g, "");

            // Remove single '</ul>' tags.
            unnumberedListStr = unnumberedListStr.replace(/<\/ul>\n?/g, "");

            // Remove last '</li>' tags.
            unnumberedListStr = unnumberedListStr.replace(/<\/li>/g, "");

            //str = str.replace(unnumberedListStr2, unnumberedListStr);
        }

        return unnumberedListStr;
    }

    ////////////////////////////// END OF UNNUMBERED LISTS /////////////////////////////
    //////////////////////////////////////////// END OF LISTS /////////////////////////////////////////////


    ////////////////////////////////////////////// HEADERS ////////////////////////////////////////////////
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

    ////////////////////////////////////////// END OF HEADERS /////////////////////////////////////////////


    /////////////////////////////////////////// HTML CODES ///////////////////////////////////////////////

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

    /////////////////////////////////////// END OF HTML CODES ////////////////////////////////////////////


    //////////////////////////////////////////// SPACES //////////////////////////////////////////////////

    // holy games with space characters
    /* Removing duplication of spaces or non-breaking space,
     combinations of space and non-breaking space.  */
    str = str.replace(/&nbsp;/g, " ");
    str = str.replace(/( )+/g, " ");
    str = str.replace(/(&nbsp;)+/g, " ");
    str = str.replace(/(&nbsp;)+( )/g, " ");
    str = str.replace(/( )+(&nbsp;)/g, " ");

    ///////////////////////////////////////// END OF SPACES //////////////////////////////////////////////


    //////////////////////////////////////////// TABLES //////////////////////////////////////////////////

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
    var tdOpenTag = str.match(/<td(.*?)>/);
    while (tdOpenTag) {
        var tdAttributes = tdOpenTag[1];
        if (tdAttributes.length > 0) {
            tdAttributes = "| " + tdAttributes + " |";
        } else {
            tdAttributes = "| ";
        }
        str = str.replace(tdOpenTag[0], tdAttributes);

        //find next match
        tdOpenTag = str.match(/<td(.*?)>/);
    }
    str = str.replace(/<\/td>/g, "");
    str = str.replace(/ \|/g, "|");

    // Double '|-' fix.
    /* In html we have '<tr> ... </tr>' tags.
     Both this tags translated to '|-' to wiki-markup.
     And when we have two or more rows with '<tr> ... </tr>' after translate we get duplication of '|-' in two rows.
     First '|-' from closing tag and second - from opening new row tag.
     Fix consist of removing that duplication.*/
    str = str.replace(/(\|-)+(.*)+(\n *)+(\|-)+/g, "|-");

    str = str.replace(/\t/g, "");

    // First '|-' in table fix.
    /* Fix consist of removing all trash (unnecessary spaces and '\n') between end of attributes and first '|-' tag. */
    str = str.replace(/\n\n\|-/g, "\n|-");

    // Last '|-' before '|}' fix.
    /* Fix consist of removing all trash between last '|-' tag and the closing table tag. */
    str = str.replace(/(\|-)+(.*)+(\n)+(\|})/g, "|}");

    ///////////////////////////////////////// END OF TABLES //////////////////////////////////////////////

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
    copyToClipboard(wiki);
}


function copyToClipboard(text) {
    var copyTextarea = $("#hiddenTextarea");
    copyTextarea.val(text);
    copyTextarea.select();
    try {
        var successful = document.execCommand('copy');
        var msg = successful ? 'successful' : 'unsuccessful';
        console.log('Copying text command was ' + msg);
    } catch (err) {
        console.log('Oops, unable to copy');
    }

}

