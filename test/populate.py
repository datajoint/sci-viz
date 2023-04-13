"""Simple test schemas."""
import datajoint as dj
from pathlib import Path


connection = dj.conn(host="localdb", user="root", password="pharus")
group1_simple = dj.Schema("test_group1_simple", connection=connection)
group2_simple = dj.Schema("test_group2_simple", connection=connection)

plot1 = dict(
    data=[
        dict(
            x=[1, 2, 3],
            y=[2, 6, 3],
            type="scatter",
            mode="lines+markers",
            marker=dict(color="red"),
        ),
        dict(type="bar", x=[1, 2, 3], y=[2, 5, 3]),
    ],
    layout=dict(title="A Fancy Plot"),
)

plot2 = dict(
    data=[
        dict(
            x=[1, 2, 3],
            y=[7, 6, 2],
            type="scatter",
            mode="lines+markers",
            marker=dict(color="purple"),
        ),
        dict(type="bar", x=[1, 2, 3], y=[2, 1, 3]),
    ],
    layout=dict(title="A Second Fancy Plot"),
)

plot3 = dict(
    data=[
        dict(
            x=[1, 2, 3],
            y=[2, 9, 3],
            type="scatter",
            mode="lines+markers",
            marker=dict(color="blue"),
        ),
        dict(type="bar", x=[1, 2, 3], y=[4, 2, 4]),
    ],
    layout=dict(title="A Very Fancy Plot"),
)


@group1_simple
class TableA(dj.Lookup):
    definition = """
    a_id: int
    ---
    a_name: varchar(30)
    """
    contents = [
        (
            0,
            "Raphael",
        ),
        (
            1,
            "Bernie",
        ),
    ]


@group1_simple
class TableB(dj.Lookup):
    definition = """
    -> TableA
    b_id: int
    ---
    b_number: float
    """
    contents = [
        (0, 10, 22.12),
        (
            0,
            11,
            -1.21,
        ),
        (
            1,
            21,
            7.77,
        ),
        (
            0,
            13,
            2.13,
        ),
        (
            0,
            15,
            -5.22,
        ),
        (
            1,
            26,
            12.33,
        ),
        (
            0,
            19,
            3.15,
        ),
        (
            0,
            22,
            -3.46,
        ),
        (
            1,
            24,
            15.97,
        ),
        (
            0,
            31,
            7.15,
        ),
        (
            0,
            33,
            -9.77,
        ),
        (
            1,
            37,
            44.33,
        ),
    ]


@group1_simple
class TableC(dj.Lookup):
    definition = """
    -> TableB
    c_id: int
    ---
    c_name = John Smith : varchar(30)
    """
    contents = [
        (0, 10, 100, -8),
        (
            0,
            11,
            200,
            "Josh",
        ),
        (
            0,
            11,
            300,
            "Lumberjack",
        ),
    ]


@group1_simple
class TableD(dj.Lookup):
    definition = """
    a_tinyint: tinyint
    ---
    a_tinyint_unsigned: tinyint unsigned
    a_smallint: smallint
    a_smallint_unsigned: smallint unsigned
    a_mediumint: mediumint
    a_mediumint_unsigned: mediumint unsigned
    a_int_unsigned: int unsigned
    a_int: int
    a_char: char(10)
    a_varchar: varchar(516)
    a_date: date
    a_time: time
    a_time_precision: time(6)
    a_datetime: datetime
    a_datetime_precision: datetime(6)
    a_timestamp: timestamp
    a_timestamp_precision: timestamp(6)
    a_enum: enum("option1", "option2", "option3")
    a_float: float
    a_double: double
    a_decimal: decimal(5,3)
    a_decimal_unsigned: decimal(6,4) unsigned
    """


@group2_simple
class TableA(dj.Lookup):
    definition = """
    a2_id: int
    ---
    a2_number: int
    """
    contents = [
        (
            0,
            0,
        ),
        (
            1,
            1,
        ),
    ]


@group2_simple
class TableB(dj.Lookup):
    definition = """
    -> TableA
    b2_id: int
    ---
    b2_number: float
    """
    contents = [
        (0, 10, 22.12),
        (
            0,
            11,
            -1.21,
        ),
        (
            1,
            21,
            7.77,
        ),
        (
            0,
            13,
            2.13,
        ),
        (
            0,
            15,
            -5.22,
        ),
        (
            1,
            26,
            12.33,
        ),
        (
            0,
            19,
            3.15,
        ),
        (
            0,
            22,
            -3.46,
        ),
        (
            1,
            24,
            15.97,
        ),
        (
            0,
            31,
            7.15,
        ),
        (
            0,
            33,
            -9.77,
        ),
        (
            1,
            37,
            44.33,
        ),
    ]


@group2_simple
class TableC(dj.Lookup):
    definition = """
    -> TableB
    c2_id: int
    ---
    c2_name = John Smith : varchar(30)
    """
    contents = [
        (0, 10, 100, -8),
        (
            0,
            11,
            200,
            "Josh",
        ),
        (
            0,
            11,
            300,
            "Lumberjack",
        ),
    ]


@group1_simple
class TableV(dj.Lookup):
    definition = """
    datetime: datetime
    v_int: int
    """
    contents = [
        ("2000-01-02 01:02:03", 1),
        ("2001-02-03 02:03:04", 2),
    ]


@group1_simple
class TableU(dj.Lookup):
    definition = """
    u_int: int
    ---
    -> TableV
    """


@group1_simple
class Mouse(dj.Lookup):
    definition = """
    mouse_id: int
    mouse_dob: datetime(6)
    ---
    mouse_name: varchar(30)
    """
    contents = [
        (0, "1998-07-13 00:11:23.153333", "jeff"),
        (1, "1928-08-13 00:13:23", "splinter"),
        (2, "1948-03-13 00:14:23", "ratman"),
    ]


@group1_simple
class MousePlots(dj.Lookup):
    definition = """
    -> Mouse
    plot_id: int
    ---
    plot: longblob
    """
    contents = [
        (0, "1998-07-13 00:11:23.153333", 0, plot1),
        (1, "1928-08-13 00:13:23", 1, plot2),
        (2, "1948-03-13 00:14:23", 2, plot3),
    ]


assert Path("/tmp/test/dog.JPG").exists()


@group1_simple
class MousePics(dj.Lookup):
    definition = """
    -> Mouse
    ---
    image_payload: attach
    """
    contents = [(0, "1998-07-13 00:11:23.153333", "/tmp/test/dog.JPG")]


@group1_simple
class PlotlyTable(dj.Lookup):
    definition = """
    p_id: int
    ---
    plot: longblob
    """
    contents = [(2, plot1)]


@group1_simple
class PresetTable(dj.Lookup):
    definition = """
    preset_name: varchar(30)
    ---
    preset_dict: longblob
    """
    contents = [
        ("preset 1", dict(b_id=2, b_number=12, a_id="blabla")),
        ("preset 2", dict(b_id=123, b_number=193492, some_junk_var=12332313144)),
        (
            "all datatypes",
            dict(
                a_tinyint=1,
                a_tinyint_unsigned=2,
                a_smallint=3,
                a_smallint_unsigned=4,
                a_mediumint=5,
                a_mediumint_unsigned=6,
                a_int=7,
                a_int_unsigned=8,
                a_char="a",
                a_varchar="b",
                a_date="2023-03-28",
                a_time="11:23:29",
                a_time_precision="11:23:31",
                a_datetime="2023-03-28 11:23:33",
                a_datetime_precision="2023-03-28 11:23:35",
                a_timestamp="2023-03-28 11:23:38",
                a_timestamp_precision="2023-03-28 11:23:39",
                a_enum="option1",
                a_float=1.1,
                a_double=2.2,
                a_decimal=3.3,
                a_decimal_unsigned=4.4,
            ),
        ),
    ]
