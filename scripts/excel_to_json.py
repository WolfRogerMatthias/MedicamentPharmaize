"""
Convert a medications Excel file into the JSON format the frontend consumes.

Usage:
    python excel_to_json.py path/to/medications.xlsx
    python excel_to_json.py path/to/medications.xlsx output.json

Expected Excel columns (case-sensitive; rename headers in Excel or here):
    id, name, brandNames, activeIngredient, drugClass, uses,
    dosage, sideEffects, contraindications, interactions, warnings

List columns (brandNames, uses, sideEffects, contraindications, interactions)
should contain items separated by a semicolon ';' in the Excel cell.
Example cell: "Headache; Fever; Toothache"
"""

import json
import re
import sys
import unicodedata
from pathlib import Path

import pandas as pd

LIST_COLUMNS = {
    "brandNames",
    "uses",
    "sideEffects",
    "contraindications",
    "interactions",
}

EXPECTED_COLUMNS = [
    "id",
    "name",
    "brandNames",
    "activeIngredient",
    "drugClass",
    "uses",
    "dosage",
    "sideEffects",
    "contraindications",
    "interactions",
    "warnings",
]


def slugify(value: str) -> str:
    value = unicodedata.normalize("NFKD", str(value)).encode("ascii", "ignore").decode("ascii")
    value = re.sub(r"[^\w\s-]", "", value).strip().lower()
    return re.sub(r"[-\s]+", "-", value)


def normalize_cell(col: str, value):
    if pd.isna(value):
        return [] if col in LIST_COLUMNS else ""
    if col in LIST_COLUMNS:
        if isinstance(value, list):
            return [str(v).strip() for v in value if str(v).strip()]
        return [item.strip() for item in str(value).split(";") if item.strip()]
    return str(value).strip()


def excel_to_records(excel_path: Path) -> list[dict]:
    df = pd.read_excel(excel_path)
    missing = [c for c in EXPECTED_COLUMNS if c not in df.columns]
    if missing:
        print(f"Warning: missing expected columns: {missing}", file=sys.stderr)

    records: list[dict] = []
    for _, row in df.iterrows():
        record: dict = {}
        for col in EXPECTED_COLUMNS:
            if col in df.columns:
                record[col] = normalize_cell(col, row[col])
            else:
                record[col] = [] if col in LIST_COLUMNS else ""

        if not record.get("name"):
            continue

        if not record.get("id"):
            record["id"] = slugify(record["name"])
        records.append(record)

    return records


def main() -> int:
    if len(sys.argv) < 2:
        print("Usage: python excel_to_json.py <excel_file> [output.json]", file=sys.stderr)
        return 1

    excel_path = Path(sys.argv[1])
    if not excel_path.exists():
        print(f"Error: file not found: {excel_path}", file=sys.stderr)
        return 1

    default_output = Path(__file__).resolve().parents[1] / "frontend" / "public" / "medications.json"
    output_path = Path(sys.argv[2]) if len(sys.argv) > 2 else default_output

    records = excel_to_records(excel_path)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with output_path.open("w", encoding="utf-8") as f:
        json.dump(records, f, indent=2, ensure_ascii=False)

    print(f"Wrote {len(records)} medications to {output_path}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
