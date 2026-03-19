FROM python:3.9-buster

ENV PYTHONUNBUFFERED=1
WORKDIR /src

RUN pip install poetry
COPY pyproject.toml* poetry.lock* ./
RUN poetry config virtualenvs.create false
RUN if [ -f pyproject.toml ]; then poetry install --no-root; fi

ENTRYPOINT ["uvicorn", "main:app", "--host", "0.0.0.0", "--reload"]