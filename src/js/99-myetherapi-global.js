var web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider('https://api.myetherapi.com/eth'));
var filter = web3.eth.filter('pending');
filter.watch(function(error, result) {
    if (!error) {
        web3.eth.getTransaction(result, function(error, data) {
			if (!error)
				$("#newTxs tr:first").after('<tr><td>'+data.from+'</td><td>'+data.to+'</td><td> '+web3.fromWei(data.value,'ether').toString()+' ETH </td></tr>');
        });
    }
});
var filter2 = web3.eth.filter('latest');
filter2.watch(function(error, result) {
    if (!error) {
        web3.eth.getBlock(result, function(error, data) {
			if (!error)
				$("#newBlocks tr:first").after('<tr><td>'+data.hash.substr(0,20)+'...</td><td>'+data.number+'</td><td> '+data.miner+'</td><td> '+data.transactions.length+'</td></tr>');
        });
    }
});

