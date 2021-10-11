import datajoint as dj

def schemas_simple(connection):
    """Simple test schemas."""

    group1_simple = dj.Schema('test_group1_simple', connection=connection)
    group2_simple = dj.Schema('test_group2_simple', connection=connection)

    @group1_simple
    class TableA(dj.Lookup):
        definition = """
        a_id: int
        ---
        a_name: varchar(30)
        """
        contents = [(0, 'Raphael',), (1, 'Bernie',)]

    @group1_simple
    class TableB(dj.Lookup):
        definition = """
        -> TableA
        b_id: int
        ---
        b_number: float
        """
        contents = [(0, 10, 22.12), (0, 11, -1.21,), (1, 21, 7.77,)]

    @group2_simple
    class DiffTableB(dj.Lookup):
        definition = """
        -> TableA
        bs_id: int
        ---
        bs_number: float
        """
        contents = [(0, -10, -99.99), (0, -11, 287.11,)]

    @group1_simple
    class TableC(dj.Lookup):
        definition = """
        -> TableB
        c_id: int
        ---
        c_int: int
        """
        contents = [(0, 10, 100, -8), (0, 11, 200, -9,), (0, 11, 300, -7,)]