import React, { FC, useState, useContext, useMemo } from 'react';

import { Column } from 'material-table';

import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { KeyboardTimePicker } from '@material-ui/pickers';

import ClearIcon from '@material-ui/icons/Clear';

import EnhancedTable from 'app/components/EnhancedTable';
import { DataContext, Critter } from 'app/providers/DataProvider/DataProvider';
import { ConfigContext } from 'app/app';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import { getMonthFromDate, MonthAlias } from 'app/utils/date-utils';

const columnDefs: Array<Column<Critter>> = [
	{
		title: '#',
		field: 'id',
		type: 'numeric',
	},
	{
		title: 'Name',
		field: 'name',
	},
	{
		title: 'Price',
		field: 'price',
		type: 'numeric',
	},
	{
		title: 'Location',
		field: 'location',
	},
	{
		title: 'Times',
		field: 'times',
		render: (data) => {
			return (
				<List>
					{data.times.map((spawnBracket) => {
						return <ListItem key={spawnBracket.label}>{spawnBracket.label}</ListItem>;
					})}
				</List>
			);
		},
	},
];

interface CritterListProps {}

const CritterList: FC<CritterListProps> = (props) => {
	document.title = 'Critter List | ACE';

	const data = useContext(DataContext);
	const critters = data.critters;

	const config = useContext(ConfigContext);

	const now = new Date();

	let currentMonth = getMonthFromDate(now);

	const [timeFilter, setTimeFilter] = useState<Date | null>(now);
	const [monthFilter, setMonthFilter] = useState<MonthAlias[]>([currentMonth]);
	const [locationFilter, setLocationFilter] = useState<string>('');

	const locations = useMemo(() => {
		let critterData = critters;

		const locationSet = new Set<string>();

		for (const critter of critterData) {
			locationSet.add(critter.location);
		}

		return Array.from(locationSet);
	}, [critters]);

	const critterData = useMemo(() => {
		let critterData = critters;

		if (timeFilter != null) {
			// filter time
			critterData = critterData.filter((critter) => {
				for (const spawnBracket of critter.times) {
					if (spawnBracket.label === 'All day') {
						return true;
					}

					let filterMinutes = timeFilter.getHours() * 60 + timeFilter.getMinutes(); // 83
					let startMinutes = spawnBracket.startHours * 60 + spawnBracket.startMinutes; // 16:00 => 960
					let endMinutes = spawnBracket.endHours * 60 + spawnBracket.endMinutes; // 09:00 => 540
					if (startMinutes > endMinutes) {
						filterMinutes += 24 * 60; // 540 + 3600 => 4140
						endMinutes += 24 * 60; // 540 + 3600 => 4140
					}

					if (filterMinutes >= startMinutes) {
						if (filterMinutes <= endMinutes) {
							return true;
						}
					}
				}

				return false;
			});
		}

		if (locationFilter !== '') {
			// filter location
			critterData = critterData.filter((critter) => critter.location === locationFilter);
		}

		if (monthFilter.length > 0) {
			// filter month
			critterData = critterData.filter((critter) => monthFilter.filter((month) => critter[month]).length > 0);
		}

		return critterData;
	}, [critters, timeFilter, locationFilter, monthFilter]);

	return (
		<div>
			<Grid container spacing={4} style={{ paddingTop: '1rem', paddingBottom: '1rem' }}>
				<Grid item xs={12}>
					<Grid container justify="space-between" spacing={2}>
						<Grid item xs={12} md={6} lg={2}>
							<div style={{ display: 'flex', alignItems: 'center' }}>
								<TextField
									id="month-filter"
									label="Month"
									select
									SelectProps={{
										multiple: true,
									}}
									variant="outlined"
									fullWidth
									value={monthFilter}
									onChange={(e) => {
										setMonthFilter((e.target.value as any) as MonthAlias[]);
									}}
								>
									{/* <MenuItem key={'empty'} value={''}></MenuItem> */}
									<MenuItem key={'jan'} value={'jan'}>
										January
									</MenuItem>
									<MenuItem key={'feb'} value={'feb'}>
										February
									</MenuItem>
									<MenuItem key={'mar'} value={'mar'}>
										March
									</MenuItem>
									<MenuItem key={'apr'} value={'apr'}>
										April
									</MenuItem>
									<MenuItem key={'may'} value={'may'}>
										May
									</MenuItem>
									<MenuItem key={'jun'} value={'jun'}>
										June
									</MenuItem>
									<MenuItem key={'jul'} value={'jul'}>
										July
									</MenuItem>
									<MenuItem key={'aug'} value={'aug'}>
										August
									</MenuItem>
									<MenuItem key={'sep'} value={'sep'}>
										September
									</MenuItem>
									<MenuItem key={'oct'} value={'oct'}>
										October
									</MenuItem>
									<MenuItem key={'nov'} value={'nov'}>
										November
									</MenuItem>
									<MenuItem key={'dec'} value={'dec'}>
										December
									</MenuItem>
								</TextField>
								<IconButton onClick={() => setMonthFilter([])}>
									<ClearIcon />
								</IconButton>
							</div>
						</Grid>

						<Grid item xs={12} md={6} lg={2}>
							<div style={{ display: 'flex', alignItems: 'center' }}>
								<KeyboardTimePicker
									margin="none"
									id="time-filter"
									label="Time"
									fullWidth
									value={timeFilter}
									inputVariant="outlined"
									onChange={(date) => {
										setTimeFilter(date);
									}}
									KeyboardButtonProps={{
										'aria-label': 'change time',
									}}
									ampm={config.useAmericanTimeFormat}
									clearable={true}
								/>
								<IconButton onClick={() => setTimeFilter(null)}>
									<ClearIcon />
								</IconButton>
							</div>
						</Grid>

						<Grid item xs={12} md={6} lg={2}>
							<div style={{ display: 'flex', alignItems: 'center' }}>
								<TextField
									id="location-filter"
									label="Location"
									select
									variant="outlined"
									fullWidth
									value={locationFilter}
									onChange={(e) => setLocationFilter(e.target.value)}
								>
									<MenuItem key={'empty'} value={''}></MenuItem>
									{locations.map((location) => {
										return (
											<MenuItem key={location} value={location}>
												{location}
											</MenuItem>
										);
									})}
								</TextField>
								<IconButton onClick={() => setLocationFilter('')}>
									<ClearIcon />
								</IconButton>
							</div>
						</Grid>
					</Grid>
				</Grid>
				<Grid item xs={12}>
					<EnhancedTable
						title={`Critter List (${critterData.length}/${data.critters.length})`}
						columns={columnDefs}
						data={critterData}
						options={{
							search: true,
							columnsButton: true,
							paging: false,
							sorting: true,
						}}
					/>
				</Grid>
			</Grid>
		</div>
	);
};

export default CritterList;