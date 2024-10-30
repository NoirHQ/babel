//! Substrate Parachain Node Template CLI

#![warn(missing_docs)]

mod chain_spec;
mod cli;
mod command;
mod eth;
mod rpc;
mod service;
mod storage_override;

fn main() -> sc_cli::Result<()> {
	command::run()
}
