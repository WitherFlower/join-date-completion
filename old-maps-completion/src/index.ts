import { CanvasRenderingContext2D, createCanvas, registerFont } from 'canvas';
import fs from 'fs';
import path from 'path';

const filePath = ""
const fontPath = "assets\\Comfortaa-VariableFont_wght.ttf";
const fileName = 'completion.png';
const completeFilePath = path.join(filePath, fileName);

if (fontPath) {
	console.log(fontPath)
	registerFont(fontPath, { family: 'Aller' });
}

const font = 'Aller';

class CompletionStats {
	scoresCount: number;
	beatmapCount: number;

	constructor(scoresCount = 0, beatmapCount = 0) {
		this.scoresCount = scoresCount;
		this.beatmapCount = beatmapCount;
	}
}

class PackStats extends CompletionStats {
	packId: number;
	constructor(packId: number, scoresCount: number, beatmapCount: number) {
		super(scoresCount, beatmapCount);
		this.packId = packId;
	}
}

class YearStats extends CompletionStats {
	year: number
	constructor(year: number, scoresCount: number, beatmapCount: number) {
		super(scoresCount, beatmapCount);
		this.year = year;
	}
}

class PackData {
	beatmap_packs: PackStats[] = [];
	approved_packs: PackStats[] = [];
	completion: CompletionStats = new CompletionStats();
	years: YearStats[] = [];
}

class User {
	userId = 9991650;
	date = "2014-01-26"
}

function getData(): PackData {

	let rawPackData = JSON.parse(fs.readFileSync("./data/PackToMap.json", 'utf8'));
	let rawScoreData = JSON.parse(fs.readFileSync("./data/PackScoreData.json", 'utf8'));
	let rawYearData = JSON.parse(fs.readFileSync("./data/YearToMap.json", 'utf8'));

	const data = new PackData();

	const LAST_PACK = 341;


	for (let packId = 1; packId <= LAST_PACK; packId++) {
		const packMapIds: number[] = rawPackData["S" + packId];

		let currentPackClears = 0;
		packMapIds.forEach((mapId: number) => {
			if (rawScoreData[mapId.toString()]['score'] > 0) {
				currentPackClears++;
			}
		});


		data.beatmap_packs[packId] = new PackStats(packId, currentPackClears, packMapIds.length);
	}

	let totalClears = 0;
	let totalMaps = 0;

	const years = Object.keys(rawYearData)

	data.years = []
	years.forEach(year => {

		let currentYearClears = 0
		rawYearData[year].forEach((mapId: number) => {
			if (rawScoreData[mapId.toString()]['score'] > 0) {
				currentYearClears++;
				totalClears++;
			}
			totalMaps++;
		});

		data.years.push(new YearStats(
			parseInt(year),
			currentYearClears,
			rawYearData[year].length
		));
	});

	data.completion = new CompletionStats(totalClears, totalMaps);

	console.log(data.beatmap_packs[1])
	console.log(data.beatmap_packs[149])
	console.log(data.beatmap_packs[150])

	console.log(data.years)

	return data;
}

function formatNumber(number: number) {
	const numberValue = Number(number);
	// if (isNaN(numberValue)) {
	// 	// If the input is not a valid number, return the original value
	// 	return number;
	// }
	return numberValue.toLocaleString('en-US');
}

function defineRoundedRect(ctx: { beginPath: () => void; moveTo: (arg0: any, arg1: any) => void; lineTo: (arg0: number, arg1: number) => void; arcTo: (arg0: any, arg1: any, arg2: number, arg3: number, arg4: any) => void; closePath: () => void; }, x: number, y: number, width: number, height: number, radius: number) {
	ctx.beginPath();
	ctx.moveTo(x + radius, y);
	ctx.lineTo(x + width - radius, y);
	ctx.arcTo(x + width, y, x + width, y + radius, radius);
	ctx.lineTo(x + width, y + height - radius);
	ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
	ctx.lineTo(x + radius, y + height);
	ctx.arcTo(x, y + height, x, y + height - radius, radius);
	ctx.lineTo(x, y + radius);
	ctx.arcTo(x, y, x + radius, y, radius);
	ctx.closePath();
}

function drawPackCompletion(ctx: CanvasRenderingContext2D) {
	const headerText = 'Beatmap Packs';
	const headerFontSize = 42;
	const headerFontColor = 'white';
	const headerFont = `bold ${headerFontSize}px ${font}`;

	// Save the current shadow settings
	const { shadowBlur, shadowColor, shadowOffsetX, shadowOffsetY } = ctx;

	// Set the shadow effect for the header text
	ctx.shadowBlur = 5;
	ctx.shadowColor = 'black';
	ctx.shadowOffsetX = 2;
	ctx.shadowOffsetY = 2;

	ctx.font = headerFont;
	ctx.fillStyle = headerFontColor;
	ctx.textAlign = 'center';
	ctx.fillText(headerText, 445, 40);

	// Reset the shadow settings
	ctx.shadowBlur = shadowBlur;
	ctx.shadowColor = shadowColor;
	ctx.shadowOffsetX = shadowOffsetX;
	ctx.shadowOffsetY = shadowOffsetY;
}

function drawYears(ctx: CanvasRenderingContext2D) {
	const headerText = 'Years';
	const headerFontSize = 42;
	const headerFontColor = 'white';
	const headerFont = `bold ${headerFontSize}px ${font}`;

	// Save the current shadow settings
	const { shadowBlur, shadowColor, shadowOffsetX, shadowOffsetY } = ctx;

	// Set the shadow effect for the header text
	ctx.shadowBlur = 5;
	ctx.shadowColor = 'black';
	ctx.shadowOffsetX = 2;
	ctx.shadowOffsetY = 2;

	ctx.font = headerFont;
	ctx.fillStyle = headerFontColor;
	ctx.textAlign = 'center';
	ctx.fillText(headerText, 1335, 40);

	// Reset the shadow settings
	ctx.shadowBlur = shadowBlur;
	ctx.shadowColor = shadowColor;
	ctx.shadowOffsetX = shadowOffsetX;
	ctx.shadowOffsetY = shadowOffsetY;
}

function drawDivider(ctx: CanvasRenderingContext2D, height: number) {
	const { shadowBlur, shadowColor, shadowOffsetX, shadowOffsetY } = ctx;

	// Set the shadow effect for the line
	ctx.shadowBlur = 3;
	ctx.shadowColor = 'black';
	ctx.shadowOffsetX = 2;
	ctx.shadowOffsetY = 2;

	// Draw the line
	ctx.beginPath();
	ctx.moveTo(890, 20);
	ctx.lineTo(890, height);
	ctx.lineWidth = 3;
	ctx.strokeStyle = 'white';
	ctx.stroke();

	// Reset the shadow settings
	ctx.shadowBlur = shadowBlur;
	ctx.shadowColor = shadowColor;
	ctx.shadowOffsetX = shadowOffsetX;
	ctx.shadowOffsetY = shadowOffsetY;
}

function drawPackSquares(ctx: CanvasRenderingContext2D, data: PackStats[], approved_data: PackStats[]) {
	const boxWidth = 28;
	const boxHeight = boxWidth;
	const gap = 4;
	const rows = Math.ceil(data.length / 25);
	const cols = 25;
	const startX = (890 - (cols * (boxWidth + gap)) + gap) / 2;
	const startY = 70;
	const size = 32;

	const { shadowBlur, shadowColor, shadowOffsetX, shadowOffsetY } = ctx;

	for (let row = 0; row < rows; row++) {

		for (let col = 0; col < cols; col++) {
			const x = startX + col * (boxWidth + gap);
			const y = startY + row * (boxHeight + gap);
			const packNumber = row * cols + col;
			const packData = data[packNumber + 1];
			const scorePercent = packData?.beatmapCount ? packData.scoresCount / packData.beatmapCount : 0;
			if (!packData) continue;

			// Draw the square
			ctx.fillStyle = `hsl(${scorePercent * 115}, 80%, 50%)`;
			defineRoundedRect(ctx, x, y, boxWidth, boxHeight, 5);
			ctx.fill();

			// create a gradient for the reflection
			const gradient = ctx.createLinearGradient(x, y, x, y + size);

			gradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
			gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

			// fill the square with the gradient
			ctx.fillStyle = gradient;
			ctx.fill();

			// Draw the pack number on top of the square
			ctx.shadowBlur = 3;
			ctx.shadowColor = 'black';
			ctx.shadowOffsetX = 1;
			ctx.shadowOffsetY = 1;

			ctx.fillStyle = 'white';
			ctx.font = `${packData.packId > 999 ? "12px" : "14px"} ${font}`;
			ctx.textAlign = 'center';
			ctx.fillText(packData.packId.toString(), x + boxWidth / 2, y + boxHeight / 2 + 5);

			ctx.shadowBlur = shadowBlur;
			ctx.shadowColor = shadowColor;
			ctx.shadowOffsetX = shadowOffsetX;
			ctx.shadowOffsetY = shadowOffsetY;

		}
	}

	// Draw the final row with approved packs
	const finalRowY = startY + rows * (boxHeight + gap);

	for (let col = 0; col < cols; col++) {
		const x = startX + col * (boxWidth + gap);
		const approvedPack = approved_data[col];
		const scorePercent = approvedPack?.beatmapCount ? approvedPack.scoresCount / approvedPack.beatmapCount : 0;
		if (!approvedPack) continue;

		// Draw the square
		ctx.fillStyle = `hsl(${scorePercent * 115}, 80%, 50%)`;
		defineRoundedRect(ctx, x, finalRowY, boxWidth, boxHeight, 5);
		ctx.fill();

		// create a gradient for the reflection
		const gradient = ctx.createLinearGradient(x, finalRowY, x, finalRowY + size);

		gradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
		gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

		// fill the square with the gradient
		ctx.fillStyle = gradient;
		ctx.fill();

		// Draw the pack number on top of the square
		ctx.shadowBlur = 3;
		ctx.shadowColor = 'black';
		ctx.shadowOffsetX = 1;
		ctx.shadowOffsetY = 1;

		ctx.fillStyle = 'white';
		ctx.font = `15px ${font}`;
		ctx.textAlign = 'center';
		ctx.fillText("A" + approvedPack.packId, x + boxWidth / 2, finalRowY + boxHeight / 2 + 5);

		ctx.shadowBlur = shadowBlur;
		ctx.shadowColor = shadowColor;
		ctx.shadowOffsetX = shadowOffsetX;
		ctx.shadowOffsetY = shadowOffsetY;
	}
}

function drawYearsProgressbars(ctx: CanvasRenderingContext2D, yearsData: YearStats[], totalHeight: number) {
	const startX = 994;
	const startY = 70;
	const barWidth = 738;
	const barCount = yearsData.length;
	const barHeight = 32;
	const totalBarsHeight = barCount * barHeight;
	const remainingHeight = totalHeight - totalBarsHeight;
	const barMargin = remainingHeight / (barCount - 1);

	for (let i = 0; i < barCount; i++) {
		const yearData = yearsData[i];
		const { year, scoresCount, beatmapCount } = yearData;
		const completionPercentage = scoresCount / beatmapCount * 100;

		const barX = startX;
		const barY = startY + (barHeight + barMargin) * i;
		const filledWidth = (barWidth * completionPercentage) / 100;

		// Draw the progress bar background with rounded corners
		defineRoundedRect(ctx, barX, barY, barWidth, barHeight, 5);
		ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
		ctx.fill();

		// Draw the filled progress bar
		ctx.fillStyle = `hsl(${completionPercentage}, 80%, 50%)`;
		defineRoundedRect(ctx, barX, barY, filledWidth, barHeight, 5);
		ctx.fill();

		// Define the gradient for the filled progress bar
		const gradient = ctx.createLinearGradient(barX, barY, barX, barY + barHeight);
		gradient.addColorStop(0, 'hsla(0, 0%, 100%, 0.3)');
		gradient.addColorStop(0.5, 'hsla(0, 0%, 100%, 0)');
		gradient.addColorStop(1, 'hsla(0, 0%, 100%, 0.3)');

		// Draw the reflection gradient
		ctx.fillStyle = gradient;
		defineRoundedRect(ctx, barX, barY, filledWidth, barHeight, 5);
		ctx.fill();

		// Set up the shadow effect for the text
		ctx.shadowColor = 'black';
		ctx.shadowOffsetX = 2;
		ctx.shadowOffsetY = 2;
		ctx.shadowBlur = 3;

		// Draw the year text
		ctx.font = `bold 22px ${font}`;
		ctx.fillStyle = '#ffffff';
		ctx.textBaseline = 'middle';
		ctx.fillText(year.toString(), barX - 35, barY + barHeight / 2);

		// Draw the text with shadow in the middle of the progress bar
		const text = `${completionPercentage.toFixed(2)}% ~ ${formatNumber(scoresCount)} / ${formatNumber(beatmapCount)}`;
		const textX = barX + barWidth / 2;
		const textY = barY + barHeight / 2;

		ctx.font = `bold 22px ${font}`;
		ctx.textAlign = 'center';
		ctx.fillText(text, textX, textY);

		// Reset the shadow settings
		ctx.shadowColor = 'transparent';
		ctx.shadowOffsetX = 0;
		ctx.shadowOffsetY = 0;
		ctx.shadowBlur = 0;
	}
}

function drawCompletionHeader(ctx: CanvasRenderingContext2D, date: string, height: number) {
	const text = `Old Map Completion`;
	//const barY = 200 + (32 + 51) * 4; // Y-coordinate of the 5th progress bar
	const barY = height;

	// Set the shadow effect for the header text
	ctx.shadowBlur = 5;
	ctx.shadowColor = 'black';
	ctx.shadowOffsetX = 2;
	ctx.shadowOffsetY = 2;

	ctx.font = `bold 28px ${font}`;
	ctx.fillStyle = '#ffffff';
	ctx.textAlign = 'center';
	ctx.fillText(text, 890, barY + 60);

	// Reset the shadow settings
	ctx.shadowColor = 'transparent';
	ctx.shadowOffsetX = 0;
	ctx.shadowOffsetY = 0;
	ctx.shadowBlur = 0;
}

function drawCompletionProgressbar(ctx: CanvasRenderingContext2D, completionData: CompletionStats, height: number) {
	const startX = 48;
	const startY = height + 30;
	const barWidth = 1684;
	const barHeight = 32;

	const completionPercentage = completionData.scoresCount / completionData.beatmapCount * 100;
	const filledWidth = (barWidth * completionPercentage) / 100;

	// Draw the progress bar background with rounded corners
	defineRoundedRect(ctx, startX, startY, barWidth, barHeight, 5);
	ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
	ctx.fill();

	// Draw the filled progress bar
	ctx.fillStyle = `hsl(${completionPercentage}, 80%, 50%)`;
	defineRoundedRect(ctx, startX, startY, filledWidth, barHeight, 5);
	ctx.fill();

	// Define the gradient for the filled progress bar
	const gradient = ctx.createLinearGradient(startX, startY, startX, startY + barHeight);
	gradient.addColorStop(0, 'hsla(0, 0%, 100%, 0.3)');
	gradient.addColorStop(0.5, 'hsla(0, 0%, 100%, 0)');
	gradient.addColorStop(1, 'hsla(0, 0%, 100%, 0.3)');

	// Draw the reflection gradient
	ctx.fillStyle = gradient;
	defineRoundedRect(ctx, startX, startY, filledWidth, barHeight, 5);
	ctx.fill();

	// Set up the shadow effect for the text
	ctx.shadowColor = 'black';
	ctx.shadowOffsetX = 2;
	ctx.shadowOffsetY = 2;
	ctx.shadowBlur = 3;

	// Draw the text with shadow in the middle of the progress bar
	const text = `${completionPercentage.toFixed(2)}% ~ ${formatNumber(completionData.scoresCount)} / ${formatNumber(completionData.beatmapCount)}`;
	const textX = startX + barWidth / 2;
	const textY = startY + barHeight / 2;

	ctx.font = `bold 22px ${font}`;
	ctx.fillStyle = '#ffffff';
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';
	ctx.fillText(text, textX, textY);

	// Reset the shadow settings
	ctx.shadowColor = 'transparent';
	ctx.shadowOffsetX = 0;
	ctx.shadowOffsetY = 0;
	ctx.shadowBlur = 0;
}

async function createImage(user: User) {
	const data = getData();

	const canvasHeight = data.beatmap_packs.length / 25 * (28 + 4) + 220
	const yearsBarsHeight = Math.ceil((data.beatmap_packs.length + data.approved_packs.length) / 25) * (28 + 4) + 4
	// Create canvas
	const canvas = createCanvas(1780, canvasHeight);
	const ctx = canvas.getContext('2d');

	// Set background color to transparent
	ctx.fillStyle = 'rgba(0,0,0,0)';
	//ctx.fillStyle = 'rgba(56, 46, 50, 1)';
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	drawPackCompletion(ctx)
	drawYears(ctx)
	drawPackSquares(ctx, data.beatmap_packs, data.approved_packs)
	drawYearsProgressbars(ctx, data.years, yearsBarsHeight)
	drawCompletionHeader(ctx, user.date, yearsBarsHeight + 40)
	drawCompletionProgressbar(ctx, data.completion, yearsBarsHeight + 40 + 60)
	drawDivider(ctx, yearsBarsHeight + 40 + 40)

	// Save PNG file
	const fileName = `${user.userId}_completion.png`;
	const completeFilePath = path.join(filePath, fileName);
	const buffer = canvas.toBuffer('image/png');
	fs.writeFileSync(completeFilePath, buffer);
	console.log(`The PNG file for ${user.userId} was created.`);
	return
}

createImage(new User());
