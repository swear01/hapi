package app.hapi.companion.feature.chat

import java.util.regex.Matcher
import java.util.regex.Pattern
import java.text.BreakIterator
import java.text.StringCharacterIterator
import java.util.Locale

internal data class TextBudget(val characters: Int, val lines: Int)
internal val InlineMessageBudget = TextBudget(8_000, 120)
internal val MessagePreviewBudget = TextBudget(2_000, 24)
internal val MessagePageBudget = TextBudget(4_000, 80)
internal val ToolPageBudget = TextBudget(20_000, 400)

internal data class TextPage(val text: String, val end: Int)
private val Grapheme = Pattern.compile("\\X")

/** Advances only through one page. Android's legacy regex engine splits emoji
 * sequences that its ICU-backed character iterator recognizes. On the JVM the
 * regex engine is newer than the iterator. Accept only boundaries shared by
 * both: neither runtime can split a recognized grapheme. Neither scans the
 * prefix or materializes a copy of the remaining document. */
internal fun readTextPage(source: String, start: Int = 0, budget: TextBudget = MessagePageBudget): TextPage {
    require(budget.characters > 0 && budget.lines > 0)
    val from = start.coerceIn(0, source.length)
    val matcher = Grapheme.matcher(source).region(from, source.length)
    val boundaries = BreakIterator.getCharacterInstance(Locale.ROOT).apply {
        setText(StringCharacterIterator(source, from, source.length, from))
    }
    var end = from
    var characters = 0
    var lines = 1
    while (characters < budget.characters && matcher.find()) {
        val first = source[matcher.start()]
        val newline = first == '\r' || first == '\n' || first == '\u2028' || first == '\u2029' || first == '\u0085'
        if (newline && lines == budget.lines && end > from) break
        if (newline) lines++
        end = sharedGraphemeEnd(matcher, boundaries)
        characters++
    }
    return TextPage(source.substring(from, end), end)
}

/** `Matcher.end()` is only valid after a successful `find()`. */
private fun sharedGraphemeEnd(matcher: Matcher, boundaries: BreakIterator): Int {
    var matchEnd = matcher.end()
    while (!boundaries.isBoundary(matchEnd)) {
        if (!matcher.find()) return matchEnd
        matchEnd = matcher.end()
    }
    return matchEnd
}

internal fun messagePreview(source: String): TextPage {
    val inline = readTextPage(source, budget = InlineMessageBudget)
    return if (inline.end == source.length) inline else readTextPage(source, budget = MessagePreviewBudget)
}
