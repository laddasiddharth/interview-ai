"""Basic test to ensure pytest runs successfully."""


def test_import_main():
    """Test that main module can be imported."""
    from app import main
    assert main is not None


def test_basic_assertion():
    """Basic test to ensure pytest is working."""
    assert True
