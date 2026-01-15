import unittest
from utils import clean_description

class TestFormatting(unittest.TestCase):
    def test_multiline_preservation(self):
        original = "Line 1.\n\nLine 2 with The Well Come Home brand.\n\nLine 3."
        expected = "Line 1.\n\nLine 2 with O.S Arquitectura brand.\n\nLine 3."
        cleaned = clean_description(original)
        print(f"Original:\n{original!r}")
        print(f"Cleaned:\n{cleaned!r}")
        self.assertEqual(cleaned, expected)
        
    def test_indentation_handling(self):
        # TABS should be collapsed to space, but newlines preserved
        original = "Start.\n\tIndented line."
        expected = "Start.\n Indented line."
        self.assertEqual(clean_description(original), expected)

if __name__ == '__main__':
    unittest.main()
