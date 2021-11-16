"""Simple test schemas."""
import datajoint as dj


connection = dj.conn(host='localdb', user='root', password='pharus')
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
    contents = [(0, 10, 22.12), (0, 11, -1.21,), (1, 21, 7.77,),
                (0, 13, 2.13,), (0, 15, -5.22,), (1, 26, 12.33,),
                (0, 19, 3.15,), (0, 22, -3.46,), (1, 24, 15.97,),
                (0, 31, 7.15,), (0, 33, -9.77,), (1, 37, 44.33,)]


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


@group1_simple
class PlotlyTable(dj.Lookup):
    definition = """
    p_id: int
    ---
    plot: longblob
    """
    contents = [(2, dict(data=[dict(x=[1, 2, 3],
                                    y=[2, 6, 3],
                                    type='scatter',
                                    mode='lines+markers',
                                    marker=dict(color='red')),
                               dict(type='bar',
                                    x=[1, 2, 3],
                                    y=[2, 5, 3])],
                         layout=dict(title='A Fancy Plot')))]
