#!/usr/bin/env node
import { readFileSync } from "fs";
import { parseCsvLine } from "./doc_hygiene_v2_9.mjs";

const sample = '"id","lesson","source","path"\n"1","Soft-fail, auto logged","system","artefacts/logs/lessons/snippets/test.md"';
const [header, data] = sample.split("\n").map(parseCsvLine);

console.log("Header:", header);
console.log("Row:", data);
